/**
 * Environment and Knowledge Base Validation Tool
 * 
 * This script verifies:
 * 1. Required environment variables for AI services are present
 * 2. Knowledge base files exist and contain valid JSON
 * 
 * Used for troubleshooting issues with AI chat and voice features
 */

import fs from 'fs';
import path from 'path';

// =================================================
// Environment variables validation
// =================================================
console.log("=== AI Services Environment Check ===");

// Required environment variables with descriptions
const requiredVars = [
  { name: 'OPENAI_API_KEY', desc: 'Required for chat functionality' }, 
  { name: 'ELEVENLABS_API_KEY', desc: 'Required for voice generation' },
  { name: 'GEMINI_API_KEY', desc: 'Alternative AI provider (optional)' }
];

const missingVars = [];
const secureReportVars = [];

for (const envVar of requiredVars) {
  // Don't log actual keys, just report presence
  if (!process.env[envVar.name]) {
    missingVars.push(envVar);
    secureReportVars.push(`❌ Missing ${envVar.name} - ${envVar.desc}`);
  } else {
    // Show limited info (first 3 and last 3 chars) for security
    const value = process.env[envVar.name];
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}`
      : '***';
    secureReportVars.push(`✓ ${envVar.name} is set (${maskedValue})`);
  }
}

// Report findings securely
secureReportVars.forEach(msg => console.log(msg));

if (missingVars.length > 0) {
  console.log(`\n⚠️ WARNING: Missing ${missingVars.length} environment variables needed for AI services`);
} else {
  console.log("\n✅ All required environment variables are set");
}

// =================================================
// Knowledge base validation
// =================================================
console.log("\n=== Knowledge Base Validation ===");
const knowledgeDir = path.join(process.cwd(), 'server', 'knowledge');
console.log(`Knowledge directory path: ${knowledgeDir}`);

// Check if directory exists
try {
  const dirExists = fs.existsSync(knowledgeDir);
  console.log(`Knowledge directory exists: ${dirExists ? '✓' : '❌'}`);
  
  if (dirExists) {
    // Check knowledge files
    const expectedFiles = [
      { name: 'companyInfo.json', required: true, desc: 'Company information and services' },
      { name: 'faqs.json', required: true, desc: 'Frequently asked questions' }
    ];
    
    let allValid = true;
    
    for (const file of expectedFiles) {
      const filePath = path.join(knowledgeDir, file.name);
      const fileExists = fs.existsSync(filePath);
      
      console.log(`\nChecking ${file.name} (${file.desc}):`);
      console.log(`  File exists: ${fileExists ? '✓' : '❌'}`);
      
      if (fileExists) {
        try {
          // Check if file is valid JSON
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const parsedContent = JSON.parse(fileContent);
          console.log(`  Contains valid JSON: ✓`);
          console.log(`  File size: ${(fileContent.length / 1024).toFixed(2)} KB`);
          
          // Perform basic content validation based on file type
          if (file.name === 'companyInfo.json') {
            if (!parsedContent.company || !parsedContent.services) {
              console.log(`  ⚠️ Warning: Missing expected sections in ${file.name}`);
              allValid = false;
            } else {
              const companyName = parsedContent.company.name || 'Unnamed';
              const servicesCount = parsedContent.services.length;
              const industriesCount = (parsedContent.industries || []).length;
              
              console.log(`  Company name: ${companyName}`);
              console.log(`  Services defined: ${servicesCount}`);
              console.log(`  Industries defined: ${industriesCount}`);
            }
          } else if (file.name === 'faqs.json') {
            const generalFaqs = (parsedContent.general_faqs || []).length;
            const serviceFaqs = (parsedContent.service_faqs || []).length;
            const technicalFaqs = (parsedContent.technical_faqs || []).length;
            
            console.log(`  General FAQs: ${generalFaqs}`);
            console.log(`  Service FAQs: ${serviceFaqs}`);
            console.log(`  Technical FAQs: ${technicalFaqs}`);
            
            if (generalFaqs + serviceFaqs + technicalFaqs === 0) {
              console.log(`  ⚠️ Warning: No FAQs defined in ${file.name}`);
              allValid = false;
            }
          }
        } catch (error) {
          console.error(`  ❌ Error parsing ${file.name}: ${error.message}`);
          allValid = false;
          
          // Try to pinpoint the error location
          if (error.message.includes('position')) {
            const posMatch = error.message.match(/position (\d+)/);
            if (posMatch) {
              const errorPos = parseInt(posMatch[1]);
              const content = fs.readFileSync(filePath, 'utf8');
              
              // Show a window around the error
              const start = Math.max(0, errorPos - 20);
              const end = Math.min(content.length, errorPos + 20);
              const preview = content.substring(start, end);
              
              console.log(`  Error context: "${preview}"`);
              console.log(`  Consider running the repair-json.js script to fix this file`);
            }
          }
        }
      } else if (file.required) {
        console.log(`  ❌ Required file ${file.name} is missing`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log("\n✅ All knowledge base files are valid");
    } else {
      console.log("\n⚠️ Some knowledge base files have issues that need to be fixed");
      console.log("  Run the repair-json.js script to automatically fix common issues");
    }
  }
} catch (error) {
  console.error(`❌ Error checking knowledge directory: ${error.message}`);
}