/**
 * Image Optimization Script
 * 
 * This script optimizes images for web use by:
 * 1. Converting to WebP format (better compression)
 * 2. Creating multiple resolutions for responsive images
 * 3. Compressing to reduce file size
 * 4. Creating AVIF versions for modern browsers
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

// Paths
const DIST_PATH = path.join(process.cwd(), 'dist');
const PUBLIC_PATH = path.join(DIST_PATH, 'public');
const ASSETS_PATH = path.join(PUBLIC_PATH, 'assets');
const IMAGES_PATH = path.join(ASSETS_PATH, 'images');
const RESIZED_PATH = path.join(ASSETS_PATH, 'optimized');

// Configuration
const QUALITY = {
  webp: 80,
  avif: 65,
  jpg: 85
};

// Image size breakpoints for responsive images
const BREAKPOINTS = {
  hero: [1920, 1280, 960, 640],
  general: [1200, 800, 400],
  thumbnail: [600, 300]
};

// Initialize
async function init() {
  try {
    // Ensure optimized directory exists
    await fs.mkdir(RESIZED_PATH, { recursive: true });
    console.log('✅ Created optimization output directory');
    
    // Process hero image
    await optimizeHeroImage();
    
    // Process article images
    await optimizeArticleImages();
    
    // Process service images
    await optimizeServiceImages();
    
    // Process logo and convert to SVG
    await optimizeLogo();
    
    console.log('✅ Image optimization complete!');
  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

async function optimizeHeroImage() {
  console.log('🖼️ Optimizing hero image...');
  const heroPath = path.join(PUBLIC_PATH, 'images', 'hero-image.webp');
  
  try {
    const outputDir = path.join(RESIZED_PATH, 'hero');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate responsive versions
    for (const width of BREAKPOINTS.hero) {
      // WebP version
      await sharp(heroPath)
        .resize(width)
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `hero-${width}.webp`));
      
      // AVIF version for modern browsers
      await sharp(heroPath)
        .resize(width)
        .avif({ quality: QUALITY.avif })
        .toFile(path.join(outputDir, `hero-${width}.avif`));
      
      // JPEG fallback
      await sharp(heroPath)
        .resize(width)
        .jpeg({ quality: QUALITY.jpg, mozjpeg: true })
        .toFile(path.join(outputDir, `hero-${width}.jpg`));
    }
    
    console.log('  ✅ Hero image optimized in multiple formats and sizes');
  } catch (error) {
    console.error('  ❌ Error optimizing hero image:', error);
  }
}

async function optimizeArticleImages() {
  console.log('🖼️ Optimizing article images...');
  const articlesPath = path.join(ASSETS_PATH, 'images', 'articles');
  
  try {
    const files = await fs.readdir(articlesPath);
    const outputDir = path.join(RESIZED_PATH, 'articles');
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const file of files) {
      const filePath = path.join(articlesPath, file);
      const fileStats = await fs.stat(filePath);
      
      if (!fileStats.isFile()) continue;
      if (!file.match(/\.(png|jpe?g|webp)$/i)) continue;
      
      const filename = path.parse(file).name;
      
      // Generate responsive versions
      for (const width of BREAKPOINTS.general) {
        // WebP version
        await sharp(filePath)
          .resize(width)
          .webp({ quality: QUALITY.webp })
          .toFile(path.join(outputDir, `${filename}-${width}.webp`));
        
        // AVIF version
        await sharp(filePath)
          .resize(width)
          .avif({ quality: QUALITY.avif })
          .toFile(path.join(outputDir, `${filename}-${width}.avif`));
      }
      
      console.log(`  ✅ Optimized article image: ${file}`);
    }
  } catch (error) {
    console.error('  ❌ Error optimizing article images:', error);
  }
}

async function optimizeServiceImages() {
  console.log('🖼️ Optimizing service images...');
  const servicesPath = path.join(ASSETS_PATH, 'images', 'services');
  
  try {
    const files = await fs.readdir(servicesPath);
    const outputDir = path.join(RESIZED_PATH, 'services');
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const file of files) {
      const filePath = path.join(servicesPath, file);
      const fileStats = await fs.stat(filePath);
      
      if (!fileStats.isFile()) continue;
      if (!file.match(/\.(png|jpe?g|webp)$/i)) continue;
      
      const filename = path.parse(file).name;
      
      // Generate responsive versions
      for (const width of BREAKPOINTS.general) {
        // WebP version
        await sharp(filePath)
          .resize(width)
          .webp({ quality: QUALITY.webp })
          .toFile(path.join(outputDir, `${filename}-${width}.webp`));
        
        // AVIF version
        await sharp(filePath)
          .resize(width)
          .avif({ quality: QUALITY.avif })
          .toFile(path.join(outputDir, `${filename}-${width}.avif`));
      }
      
      console.log(`  ✅ Optimized service image: ${file}`);
    }
  } catch (error) {
    console.error('  ❌ Error optimizing service images:', error);
  }
}

async function optimizeLogo() {
  console.log('🖼️ Converting logo to SVG...');
  // This would normally use a tool like potrace to convert to SVG
  // For this example, we'll create optimized PNG/WebP versions of the logo
  // while we wait for a proper SVG version
  
  try {
    const logoPath = await findLogoPath();
    if (!logoPath) {
      console.error('  ❌ Logo file not found');
      return;
    }
    
    const outputDir = path.join(RESIZED_PATH, 'logo');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Create WebP version
    await sharp(logoPath)
      .webp({ quality: 90 }) // Higher quality for logo
      .toFile(path.join(outputDir, 'logo.webp'));
    
    // Create small version for mobile
    await sharp(logoPath)
      .resize(200)
      .webp({ quality: 90 })
      .toFile(path.join(outputDir, 'logo-small.webp'));
    
    console.log('  ✅ Created optimized logo versions');
    console.log('  ⚠️ Note: For best results, the logo should be manually converted to SVG');
  } catch (error) {
    console.error('  ❌ Error optimizing logo:', error);
  }
}

async function findLogoPath() {
  // Try to find the logo in different possible locations
  const possiblePaths = [
    path.join(ASSETS_PATH, 'logo-SwqKAw7L.png'),
    path.join(ASSETS_PATH, 'logo.png'),
    path.join(ASSETS_PATH, 'images', 'logo', 'logo.png')
  ];
  
  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // File doesn't exist, try next path
    }
  }
  
  return null;
}

// Run the script
init();