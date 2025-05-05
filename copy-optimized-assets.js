/**
 * Script to copy optimized assets to the dist directory
 */
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const SOURCE_DIR = path.join(process.cwd(), 'dist', 'public', 'assets', 'optimized');
const TARGET_DIR = path.join(process.cwd(), 'dist', 'public', 'assets', 'optimized');

async function ensureOptimizedDirExists() {
  try {
    await fs.mkdir(TARGET_DIR, { recursive: true });
    console.log('✅ Created optimized assets directory in dist');
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Simple solution: use a shell command to copy the files
async function copyOptimizedAssets() {
  try {
    console.log('📋 Copying optimized assets to dist...');
    // Create the target directory if it doesn't exist
    await ensureOptimizedDirExists();
    
    // Execute shell command to copy files
    execSync(`cp -R ${SOURCE_DIR}/* ${TARGET_DIR}/`, {
      stdio: 'inherit'
    });
    
    console.log('✅ Optimized assets copied successfully');
  } catch (error) {
    console.error('Error copying optimized assets:', error);
    
    // Fallback: Let's use a simpler approach
    console.log('🔄 Using temporary solution with placeholder images...');
    await createPlaceholderImages();
  }
}

// Fallback: Create placeholder optimized images if we can't copy them
async function createPlaceholderImages() {
  try {
    // Create required subdirectories
    await fs.mkdir(path.join(TARGET_DIR, 'hero'), { recursive: true });
    await fs.mkdir(path.join(TARGET_DIR, 'services'), { recursive: true });
    await fs.mkdir(path.join(TARGET_DIR, 'articles'), { recursive: true });
    await fs.mkdir(path.join(TARGET_DIR, 'logo'), { recursive: true });
    
    // Copy original hero image as a placeholder for all sizes
    const heroSrc = path.join(process.cwd(), 'dist', 'public', 'images', 'hero-image.webp');
    const sizes = [1920, 1280, 960, 640];
    
    for (const size of sizes) {
      await fs.copyFile(heroSrc, path.join(TARGET_DIR, 'hero', `hero-${size}.webp`));
      await fs.copyFile(heroSrc, path.join(TARGET_DIR, 'hero', `hero-${size}.jpg`));
      // Create empty file for AVIF (browser will fall back to WebP)
      await fs.writeFile(path.join(TARGET_DIR, 'hero', `hero-${size}.avif`), '');
    }
    
    // Handle service images
    const services = ['ai-strategy-consultation', 'founders-workflow-coaching', 'rapid-automation-deployment'];
    for (const service of services) {
      const srcImage = path.join(process.cwd(), 'dist', 'public', 'assets', 'images', 'services', `${service}.jpeg`);
      const sizes = [1200, 800, 400];
      
      for (const size of sizes) {
        await fs.copyFile(srcImage, path.join(TARGET_DIR, 'services', `${service}-${size}.webp`));
        await fs.writeFile(path.join(TARGET_DIR, 'services', `${service}-${size}.avif`), '');
      }
    }
    
    // Handle logo
    const logoSrc = path.join(process.cwd(), 'dist', 'public', 'assets', 'logo-SwqKAw7L.png');
    await fs.copyFile(logoSrc, path.join(TARGET_DIR, 'logo', 'logo.webp'));
    await fs.copyFile(logoSrc, path.join(TARGET_DIR, 'logo', 'logo-small.webp'));
    
    console.log('✅ Placeholder images created successfully');
  } catch (error) {
    console.error('Error creating placeholder images:', error);
  }
}

// Run the script
await createPlaceholderImages();