import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "src", "assets"),
    },
  },
  optimizeDeps: {
    include: ['@radix-ui/react-slot'],
  },
  root: path.resolve(__dirname, "client"),
  build: {
    // Explicitly set output directory - this must match where the server looks for static files
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Basic minification that's more reliable than terser for this project
    minify: 'esbuild',
    // Configure chunk splitting for better performance - keeping it simple
    rollupOptions: {
      output: {
        // Split vendor code for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter'],
        },
      },
    },
  },
  // Make sure we generate a proper static site
  publicDir: path.resolve(__dirname, "client/public"),
});
