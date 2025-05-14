/**
 * Cleanup script for Softworks Trading Web
 * 
 * This script moves redundant files to a backup directory
 * rather than deleting them directly, as a safety measure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create backup directory with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, `backup-${timestamp}`);

// Files to move to backup
const filesToBackup = [
  // Large files
  'website-dist.zip',
  
  // Redundant server implementations
  'debug-server.js',
  'debug-server-fixed.js', 
  'debug-server-voice.js',
  'simple-server.js',
  'simple-static-server.js',
  'simple-static.js',
  'test-server.js',
  'test-chat.js',
  'test-chat-fixed.js',
  
  // Test/debug files
  'debug-api-config.js',
  'debug-check.js',
  'debug-csrf.js',
  'debug-environment.js',
  'debug-routes.js',
  'test-ai.js',
  'test-api-endpoints.js',
  'test-debug-server.js',
  'test-connection.js',
  'test-voice.js',
  'dev-test-server.js',
  'check-test-server.js',
  
  // Simple/demo files
  'simple-chat.js',
  'simple-serve.js',
  
  // HTML test files
  'simple-chat.html',
  'test-chat.html',
  'test-links.html',
  
  // Temporary files
  'client.pid',
  'server.pid',
  'test-server.js.bak'
];

// Stats for reporting
const stats = {
  totalFiles: filesToBackup.length,
  filesMoved: 0,
  filesNotFound: 0,
  totalSizeReclaimed: 0
};

// Create the backup directory
console.log(`Creating backup directory: ${backupDir}`);
try {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('Backup directory created successfully');
} catch (err) {
  console.error(`Error creating backup directory: ${err.message}`);
  process.exit(1);
}

// Move files to backup
console.log('\nMoving files to backup:');
filesToBackup.forEach(file => {
  const filePath = path.join(__dirname, file);
  const backupPath = path.join(backupDir, file);
  
  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Get file size before moving
      const fileStats = fs.statSync(filePath);
      const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
      
      // Create subdirectories in backup if needed
      const backupFileDir = path.dirname(backupPath);
      if (!fs.existsSync(backupFileDir)) {
        fs.mkdirSync(backupFileDir, { recursive: true });
      }
      
      // Move the file
      fs.renameSync(filePath, backupPath);
      console.log(`✓ Moved: ${file} (${fileSizeMB} MB)`);
      
      stats.filesMoved++;
      stats.totalSizeReclaimed += fileStats.size;
    } else {
      console.log(`✗ Not found: ${file}`);
      stats.filesNotFound++;
    }
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});

// Print summary
console.log('\nCleanup Summary:');
console.log('-------------------');
console.log(`Total files targeted: ${stats.totalFiles}`);
console.log(`Files moved to backup: ${stats.filesMoved}`);
console.log(`Files not found: ${stats.filesNotFound}`);
console.log(`Total size reclaimed: ${(stats.totalSizeReclaimed / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Backup directory: ${backupDir}`);
console.log('\nTo restore files, move them back from the backup directory.');
console.log('To permanently delete the backed up files: rm -rf ' + backupDir);