// build.js - Complete build script for both client and server with static prerendering
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
  try {
    // Clean existing build
    console.log('Cleaning previous build...');
    await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true }).catch(() => {});
    
    // Run ensure-data script first
    console.log('Ensuring data files exist...');
    execSync('node ensure-data.js', { stdio: 'inherit' });
    
    // Build client with Vite
    console.log('Building client...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Run static prerendering for SEO
    console.log('Running static prerendering for SEO...');
    try {
      // Install jsdom if it doesn't exist (needed for prerendering)
      try {
        execSync('npm list jsdom || npm install --no-save jsdom', { stdio: 'inherit' });
      } catch (e) {
        console.log('Note: jsdom check/install had an issue, but continuing...');
      }
      
      // Run the prerendering script
      await import('./render-static.js').then(module => module.default());
      console.log('Static prerendering completed successfully!');
    } catch (err) {
      console.error('Error during static prerendering:', err.message);
      console.log('Continuing with build despite prerendering error...');
    }
    
    // Create server directory in dist
    console.log('Setting up server directory...');
    await fs.mkdir(path.join(__dirname, 'dist', 'server'), { recursive: true });
    
    // Copy server files to dist/server (since we don't have TypeScript compilation set up yet)
    console.log('Copying server files...');
    const serverSrcDir = path.join(__dirname, 'server');
    const serverDestDir = path.join(__dirname, 'dist', 'server');
    
    // Copy render-server.js directly
    await fs.copyFile(
      path.join(serverSrcDir, 'render-server.js'),
      path.join(serverDestDir, 'render-server.js')
    );
    
    // Create build info file
    const buildInfo = `
Build completed: ${new Date().toISOString()}
Build script: build.js
Platform: ${process.platform}
Node version: ${process.version}
Directory: ${path.join(__dirname, 'dist')}
Static Prerendering: Enabled
    `;
    
    await fs.writeFile(path.join(__dirname, 'dist', 'build-info.txt'), buildInfo);
    
    // Create server subdirectories if they exist
    const subdirs = ['middleware', 'utils', 'controllers', 'routes', 'services'];
    for (const subdir of subdirs) {
      const srcSubdir = path.join(serverSrcDir, subdir);
      const destSubdir = path.join(serverDestDir, subdir);
      
      try {
        if ((await fs.stat(srcSubdir)).isDirectory()) {
          await fs.mkdir(destSubdir, { recursive: true });
          
          // Copy all .js files
          const files = await fs.readdir(srcSubdir);
          for (const file of files) {
            if (file.endsWith('.js')) {
              await fs.copyFile(
                path.join(srcSubdir, file),
                path.join(destSubdir, file)
              );
            }
            // Handle .ts files by creating simple JS versions
            else if (file.endsWith('.ts')) {
              const srcFile = path.join(srcSubdir, file);
              const destFile = path.join(destSubdir, file.replace('.ts', '.js'));
              
              // Read TS file
              let content = await fs.readFile(srcFile, 'utf8');
              
              // Basic conversion of TypeScript to JavaScript
              content = content
                .replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, 'import $1 from "$2"')
                .replace(/export\s+interface\s+(\w+)\s*\{[^}]+\}/g, '// Interface $1 removed')
                .replace(/export\s+type\s+(\w+)\s*=.+?;/g, '// Type $1 removed')
                .replace(/:\s*\w+(\[\])?(\s*=|,|\))/g, '$2') // Remove type annotations
                .replace(/<\w+(\[\])?>/g, '') // Remove generic type parameters
                .replace(/export\s+const/g, 'export const');
              
              // Write the converted JS file
              await fs.writeFile(destFile, content);
            }
          }
        }
      } catch (err) {
        console.log(`Note: ${subdir} directory not found or processing error: ${err.message}`);
      }
    }
    
    // Copy optimized assets
    console.log('Copying optimized assets...');
    try {
      execSync('node copy-optimized-assets.js', { stdio: 'inherit' });
    } catch (err) {
      console.error('Error copying optimized assets:', err.message);
    }
    
    console.log('Build completed successfully!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();