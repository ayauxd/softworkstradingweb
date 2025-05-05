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
    // Optimize the build
    minify: 'terser',
    // Configure chunk splitting for better performance
    rollupOptions: {
      output: {
        // Split vendor code for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-popover'],
        },
        // Use hashed filenames for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    // Report build stats
    reportCompressedSize: true,
  },
  // Make sure we generate a proper static site
  publicDir: path.resolve(__dirname, "client/public"),
});
