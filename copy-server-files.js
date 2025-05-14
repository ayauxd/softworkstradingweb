// Script to copy server files to the dist directory for Render deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper to copy files
function copyFile(src, dest) {
  try {
    // Check if it's a TypeScript file that needs to be converted to JavaScript
    if (src.endsWith('.ts')) {
      // For TypeScript files, we'll create a simple JavaScript equivalent
      // This is a basic conversion - in a real project you'd use a proper TS compiler
      let content = fs.readFileSync(src, 'utf8');
      
      // Replace TypeScript-specific syntax with JavaScript equivalents
      content = content
        .replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, 'import $1 from "$2"')
        .replace(/export\s+interface\s+(\w+)\s*\{[^}]+\}/g, '// Interface $1 removed')
        .replace(/export\s+type\s+(\w+)\s*=.+?;/g, '// Type $1 removed')
        .replace(/:\s*\w+(\[\])?(\s*=|,|\))/g, '$2') // Remove type annotations
        .replace(/<\w+(\[\])?>/g, '') // Remove generic type parameters
        .replace(/export\s+const/g, 'export const');
        
      // Write the converted JS file
      const jsDestPath = dest.replace(/\.ts$/, '.js');
      fs.writeFileSync(jsDestPath, content);
      console.log(`Converted & Copied: ${path.basename(src)} → ${jsDestPath}`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${path.basename(src)} → ${dest}`);
    }
  } catch (err) {
    console.error(`Error copying ${src}: ${err.message}`);
  }
}

// Helper to copy a directory
function copyDir(src, dest) {
  ensureDir(dest);
  
  try {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error copying directory ${src}: ${err.message}`);
  }
}

console.log('=== COPYING SERVER FILES FOR DEPLOYMENT ===');

// Ensure server directory exists in dist
const serverDistDir = path.join(__dirname, 'dist', 'server');
ensureDir(serverDistDir);

// Copy the render-server.js file
const renderServerSrc = path.join(__dirname, 'server', 'render-server.js');
const renderServerDest = path.join(serverDistDir, 'render-server.js');

console.log(`Copying render-server.js: ${renderServerSrc} → ${renderServerDest}`);
copyFile(renderServerSrc, renderServerDest);

// If there are server utilities or middleware to copy
const serverUtilsDir = path.join(__dirname, 'server', 'utils');
const serverUtilsDestDir = path.join(serverDistDir, 'utils');

if (fs.existsSync(serverUtilsDir)) {
  console.log(`Copying server utils: ${serverUtilsDir} → ${serverUtilsDestDir}`);
  copyDir(serverUtilsDir, serverUtilsDestDir);
}

const serverMiddlewareDir = path.join(__dirname, 'server', 'middleware');
const serverMiddlewareDestDir = path.join(serverDistDir, 'middleware');

if (fs.existsSync(serverMiddlewareDir)) {
  console.log(`Copying server middleware: ${serverMiddlewareDir} → ${serverMiddlewareDestDir}`);
  copyDir(serverMiddlewareDir, serverMiddlewareDestDir);
}

console.log('=== SERVER FILES COPIED SUCCESSFULLY ===');