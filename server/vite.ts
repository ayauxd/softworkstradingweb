import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost'] as true | string[],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try various paths in order
  const paths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist"),
    path.resolve(process.cwd())
  ];
  
  // Log all paths we're checking
  log("Checking for static files in the following paths:");
  paths.forEach(p => log(` - ${p} (exists: ${fs.existsSync(p)})`));
  
  // Set up static file serving for all paths that exist
  paths.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
      log(`Serving static files from: ${dirPath}`);
      app.use(express.static(dirPath));
      
      // Also check for index.html specifically
      const indexPath = path.join(dirPath, "index.html");
      if (fs.existsSync(indexPath)) {
        log(`Found index.html at ${indexPath}`);
      }
    }
  });
  
  // Fall through to index.html for SPA routing
  app.use("*", (_req, res) => {
    // Try to find an index.html in any of our paths
    for (const dirPath of paths) {
      const indexPath = path.join(dirPath, "index.html");
      if (fs.existsSync(indexPath)) {
        log(`Serving index.html from ${indexPath}`);
        return res.sendFile(indexPath);
      }
    }
    
    // If no index.html found anywhere
    res.status(500).send(`
      <html>
        <head><title>Server Running</title></head>
        <body>
          <h1>Server is running but no index.html was found</h1>
          <p>The server is running correctly, but couldn't locate the front-end files.</p>
          <p>Check the build logs for more information.</p>
          <p>Current working directory: ${process.cwd()}</p>
          <p>Checked paths: ${paths.join(', ')}</p>
        </body>
      </html>
    `);
  });
}
