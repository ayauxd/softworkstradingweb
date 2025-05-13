/**
 * Enhanced JSON repair utility for fixing knowledge base files
 * 
 * This script identifies and fixes common JSON syntax errors, focusing on:
 * - Line breaks in string values
 * - Missing commas between elements
 * - Unescaped quotes in strings
 * 
 * Usage: node repair-json.js
 */

import fs from 'fs';
import path from 'path';

// Path to the problematic JSON file
const filePath = path.join(process.cwd(), 'server', 'knowledge', 'companyInfo.json');
const backupPath = `${filePath}.backup`;

console.log(`Starting JSON repair utility...`);
console.log(`Target file: ${filePath}`);

// Read the JSON file
try {
  console.log('Reading knowledge base file...');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.log(`File loaded, size: ${(fileContent.length / 1024).toFixed(2)} KB`);
  
  // First check - try parsing to identify if there's an error
  try {
    JSON.parse(fileContent);
    console.log('✅ JSON file is already valid! No fixes needed.');
    process.exit(0);
  } catch (parseError) {
    // If we get here, the file has JSON syntax errors
    console.log('⚠️ JSON syntax error detected:');
    
    // Extract error position and message
    const errorMessage = parseError.message;
    const positionMatch = errorMessage.match(/position (\d+)/);
    const problemPosition = positionMatch ? parseInt(positionMatch[1]) : 12397; // Default to known position if not found
    
    console.log(`Error details: ${errorMessage}`);
    
    // Extract context around the error (50 chars before and after)
    const contextStart = Math.max(0, problemPosition - 50);
    const contextEnd = Math.min(fileContent.length, problemPosition + 50);
    const problemContext = fileContent.substring(contextStart, contextEnd);
    
    // Show the problem context
    console.log(`\nProblem context around position ${problemPosition}:`);
    console.log('================================================');
    console.log(problemContext);
    console.log('================================================');
    
    // Create backup before making changes
    try {
      console.log(`Creating backup at ${backupPath}...`);
      fs.writeFileSync(backupPath, fileContent);
      console.log('✅ Backup created successfully');
    } catch (backupError) {
      console.error('❌ Failed to create backup file:', backupError.message);
      console.error('Aborting repair to prevent data loss');
      process.exit(1);
    }
    
    // Apply repair strategies
    console.log('\nAttempting automatic repairs...');
    let repairedContent = fileContent;
    let repairApplied = false;
    
    // 1. Fix for title with line break
    if (problemContext.includes('\n') && problemContext.includes('title')) {
      console.log('Applying repair: Fixing line break in title...');
      const titleMatch = /title": "([^"]*)\n([^"]*)"/g;
      const previousContent = repairedContent;
      repairedContent = repairedContent.replace(titleMatch, (match, p1, p2) => {
        return `title": "${p1} ${p2}"`;
      });
      if (previousContent !== repairedContent) {
        repairApplied = true;
        console.log('✅ Fixed line break in title');
      }
    }
    
    // 2. Fix for unescaped quotes in strings
    if (problemContext.includes('"') && problemContext.match(/["'].*["'].*["']/)) {
      console.log('Checking for unescaped quotes...');
      const quoteMatch = /"([^"\\]*[^\\])"([^"]*)"/g;
      const previousContent = repairedContent;
      repairedContent = repairedContent.replace(quoteMatch, (match, p1, p2) => {
        if (p1.includes('"')) {
          return `"${p1.replace(/"/g, '\\"')}"${p2}"`;
        }
        return match;
      });
      if (previousContent !== repairedContent) {
        repairApplied = true;
        console.log('✅ Fixed unescaped quotes');
      }
    }
    
    // 3. Remove any unexpected control characters
    if (problemContext.match(/[\x00-\x1F]/)) {
      console.log('Removing control characters...');
      const previousContent = repairedContent;
      repairedContent = repairedContent.replace(/[\x00-\x1F]/g, ' ').replace(/\s+/g, ' ');
      if (previousContent !== repairedContent) {
        repairApplied = true;
        console.log('✅ Removed control characters');
      }
    }
    
    // If no specific repairs were applied, alert the user
    if (!repairApplied) {
      console.log('⚠️ No specific repairs were identified. Manual inspection recommended.');
      console.log('Review the error context and edit the file directly.');
      console.log(`Original file backed up to: ${backupPath}`);
      process.exit(1);
    }
    
    // Validate the repaired content
    try {
      console.log('Validating repaired JSON...');
      JSON.parse(repairedContent);
      console.log('✅ Repair successful! JSON is now valid.');
      
      // Write the repaired content
      try {
        fs.writeFileSync(filePath, repairedContent);
        console.log(`✅ Repaired content written to: ${filePath}`);
        
        // Final validation
        const finalContent = fs.readFileSync(filePath, 'utf8');
        JSON.parse(finalContent);
        console.log('✅ Final validation successful. Knowledge base is ready to use.');
      } catch (writeError) {
        console.error(`❌ Failed to write repaired file: ${writeError.message}`);
        console.log(`Please use the backup file at ${backupPath} and repair manually.`);
        process.exit(1);
      }
    } catch (validationError) {
      console.error(`❌ Repair attempt failed! JSON is still invalid: ${validationError.message}`);
      console.log(`Please use the backup file at ${backupPath} and repair manually.`);
      
      // Create diagnostic file with line numbers for manual repair
      try {
        const lines = repairedContent.split('\n');
        let numberedContent = '';
        
        for (let i = 0; i < lines.length; i++) {
          const lineNum = i + 1;
          numberedContent += `${lineNum.toString().padStart(5, ' ')}: ${lines[i]}\n`;
        }
        
        const diagnosticPath = `${filePath}.diagnostic`;
        fs.writeFileSync(diagnosticPath, numberedContent);
        console.log(`Diagnostic file with line numbers written to: ${diagnosticPath}`);
        
        // If we have a specific position from the error, highlight it
        if (validationError.message.includes('position')) {
          const posMatch = validationError.message.match(/position (\d+)/);
          if (posMatch) {
            const newErrorPos = parseInt(posMatch[1]);
            
            // Calculate line and column
            let lineNum = 1;
            let colNum = 0;
            let pos = 0;
            
            while (pos < newErrorPos && pos < repairedContent.length) {
              if (repairedContent[pos] === '\n') {
                lineNum++;
                colNum = 0;
              } else {
                colNum++;
              }
              pos++;
            }
            
            console.log(`\nError likely in line ${lineNum}, column ${colNum}`);
          }
        }
      } catch (diagnosticError) {
        console.error(`Error creating diagnostic file: ${diagnosticError.message}`);
      }
      
      process.exit(1);
    }
  }
} catch (readError) {
  console.error(`❌ Failed to read file: ${readError.message}`);
  process.exit(1);
}