/**
 * Maintenance Cleanup Script for Softworks Trading Web
 *
 * This script helps maintain a clean codebase by identifying and optionally removing:
 * 1. Temporary files (.pid, .log, .tmp)
 * 2. Large generated files (website-dist.zip, etc.)
 * 3. Backup files (.bak)
 * 4. Debug/test files that match patterns
 *
 * Usage:
 * - node maintenance-cleanup.js         # Scan and report only
 * - node maintenance-cleanup.js --clean # Scan and move to backup directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');
const dryRun = !shouldClean;

// Create backup directory with timestamp if cleaning
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, `maintenance-backup-${timestamp}`);

// File patterns to identify
const patterns = {
  tempFiles: ['.pid', '.tmp', '.log'],
  largeFiles: ['website-dist.zip', '.zip'],
  backupFiles: ['.bak'],
  debugTestFiles: ['test-', 'debug-', 'simple']
};

// Stats for reporting
const stats = {
  tempFiles: { count: 0, size: 0 },
  largeFiles: { count: 0, size: 0 },
  backupFiles: { count: 0, size: 0 },
  debugTestFiles: { count: 0, size: 0 },
  totalFiles: 0,
  totalSize: 0
};

// Excluded directories
const excludeDirs = ['node_modules', '.git', 'dist', 'backup-'];

/**
 * Check if file matches any pattern
 */
function matchesPattern(filename, patternList) {
  return patternList.some(pattern => filename.includes(pattern));
}

/**
 * Get file category
 */
function getFileCategory(filename) {
  if (matchesPattern(filename, patterns.tempFiles)) return 'tempFiles';
  if (matchesPattern(filename, patterns.largeFiles)) return 'largeFiles';
  if (matchesPattern(filename, patterns.backupFiles)) return 'backupFiles';
  if (matchesPattern(filename, patterns.debugTestFiles)) return 'debugTestFiles';
  return null;
}

/**
 * Format file size
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Scan directory recursively
 */
function scanDirectory(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    
    // Skip excluded directories
    if (entry.isDirectory() && excludeDirs.some(excluded => entry.name.startsWith(excluded))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      scanDirectory(entryPath, fileList);
    } else {
      const category = getFileCategory(entry.name);
      if (category) {
        const size = fs.statSync(entryPath).size;
        fileList.push({
          path: entryPath,
          size,
          category
        });
      }
    }
  }
  
  return fileList;
}

/**
 * Move file to backup directory
 */
function moveToBackup(filePath, size) {
  try {
    const relativePath = path.relative(__dirname, filePath);
    const backupPath = path.join(backupDir, relativePath);
    
    // Create subdirectories in backup if needed
    const backupFileDir = path.dirname(backupPath);
    if (!fs.existsSync(backupFileDir)) {
      fs.mkdirSync(backupFileDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(filePath, backupPath);
    console.log(`  ✓ Moved: ${relativePath} (${formatSize(size)})`);
    return true;
  } catch (err) {
    console.error(`  ✗ Error moving ${filePath}: ${err.message}`);
    return false;
  }
}

// Create backup directory if needed
if (shouldClean) {
  console.log(`Creating backup directory: ${backupDir}`);
  try {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('Backup directory created successfully');
  } catch (err) {
    console.error(`Error creating backup directory: ${err.message}`);
    process.exit(1);
  }
}

// Scan for files
console.log(`\nScanning for files to clean up in ${__dirname}...`);
const filesToClean = scanDirectory(__dirname);

// Update stats
filesToClean.forEach(file => {
  stats[file.category].count++;
  stats[file.category].size += file.size;
  stats.totalFiles++;
  stats.totalSize += file.size;
});

// Print report
console.log('\nMaintenance Cleanup Report:');
console.log('=========================');
console.log(`Mode: ${dryRun ? 'Scan only (dry run)' : 'Cleanup'}`);
console.log('\nFiles detected:');
console.log(`  Temporary files: ${stats.tempFiles.count} (${formatSize(stats.tempFiles.size)})`);
console.log(`  Large files: ${stats.largeFiles.count} (${formatSize(stats.largeFiles.size)})`);
console.log(`  Backup files: ${stats.backupFiles.count} (${formatSize(stats.backupFiles.size)})`);
console.log(`  Debug/test files: ${stats.debugTestFiles.count} (${formatSize(stats.debugTestFiles.size)})`);
console.log(`\nTotal: ${stats.totalFiles} files (${formatSize(stats.totalSize)})`);

// Clean up if requested
if (shouldClean && stats.totalFiles > 0) {
  console.log('\nMoving files to backup directory:');
  
  // Group by category for better reporting
  const categories = Object.keys(patterns);
  let movedCount = 0;
  
  categories.forEach(category => {
    const categoryFiles = filesToClean.filter(file => file.category === category);
    if (categoryFiles.length > 0) {
      console.log(`\n${category}:`);
      categoryFiles.forEach(file => {
        if (moveToBackup(file.path, file.size)) {
          movedCount++;
        }
      });
    }
  });
  
  console.log(`\n${movedCount} files moved to backup directory: ${backupDir}`);
  console.log('To restore files, move them back from the backup directory.');
  console.log('To permanently delete the backed up files: rm -rf ' + backupDir);
} else if (stats.totalFiles > 0) {
  console.log('\nTo clean up these files, run:');
  console.log('  node maintenance-cleanup.js --clean');
} else {
  console.log('\nNo files to clean up!');
}

// Add this script to package.json as a maintenance command
if (!dryRun) {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!packageJson.scripts.maintenance) {
        packageJson.scripts.maintenance = 'node maintenance-cleanup.js';
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('\nAdded maintenance script to package.json. You can now run:');
        console.log('  npm run maintenance       # Scan only');
        console.log('  npm run maintenance -- --clean  # Clean up files');
      }
    }
  } catch (err) {
    console.error('Could not update package.json:', err.message);
  }
}