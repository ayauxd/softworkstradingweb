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
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    log(`Warning: Could not find the build directory: ${distPath}, looking for alternate paths...`);
    
    // Try alternative paths in case of production environment inconsistencies
    const alternativePaths = [
      path.resolve(process.cwd(), "public"),
      path.resolve(process.cwd(), "client", "dist"),
      path.resolve(process.cwd(), "dist")
    ];
    
    for (const altPath of alternativePaths) {
      if (fs.existsSync(altPath)) {
        log(`Found alternative static path: ${altPath}`);
        app.use(express.static(altPath));
        
        // fall through to index.html if the file doesn't exist
        app.use("*", (_req, res) => {
          if (fs.existsSync(path.resolve(altPath, "index.html"))) {
            res.sendFile(path.resolve(altPath, "index.html"));
          } else {
            res.status(500).send("Server is running but static files are missing.");
          }
        });
        
        return;
      }
    }
    
    // If we get here, none of the paths worked
    app.use("*", (_req, res) => {
      res.status(500).send("Static files not found. Build process may have failed.");
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
