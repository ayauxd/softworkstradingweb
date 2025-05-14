#!/usr/bin/env node

/**
 * MCP Configuration Script for Scaffolding
 * 
 * This script configures MCP integration for the project scaffolding.
 * It creates a .mcp.json configuration file and sets up MCP-related files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, 'templates');
const rootDir = process.cwd();

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};

args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    params[key] = value || true;
  }
});

// Get required parameters
const configFile = params.file || '.mcp.json';
const servers = (params.servers || 'typescript,puppeteer,desktop-commander,node').split(',');

// Read project metadata
let projectName = 'Project';
let aiServices = [];
let isTypeScript = false;
let isReact = false;

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  projectName = packageJson.name || 'Project';
  
  // Detect TypeScript
  isTypeScript = Boolean(packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript);
  
  // Detect React
  isReact = Boolean(packageJson.dependencies?.react);
  
  console.log(`Project name: ${projectName}`);
  console.log(`TypeScript: ${isTypeScript ? 'Yes' : 'No'}`);
  console.log(`React: ${isReact ? 'Yes' : 'No'}`);
} catch (error) {
  console.warn('Warning: Could not read package.json. Using default values.');
}

// Configure AI services based on provided servers
if (servers.includes('openai')) {
  aiServices.push({
    name: 'openai',
    command: 'openai-mcp-server',
    description: 'OpenAI API integration',
    package: 'openai-mcp-server',
    example_prompt: 'Generate a product description for our service.'
  });
}

if (servers.includes('elevenlabs')) {
  aiServices.push({
    name: 'elevenlabs',
    command: '@angelogiacco/elevenlabs-mcp-server',
    description: 'ElevenLabs voice generation integration',
    package: '@angelogiacco/elevenlabs-mcp-server',
    example_prompt: 'Convert this text to speech: "Welcome to our platform."'
  });
}

if (servers.includes('gemini')) {
  aiServices.push({
    name: 'gemini',
    command: 'node scripts/create-gemini-mcp.js',
    description: 'Google Gemini API integration',
    package: '@google/genai',
    env: {
      GEMINI_API_KEY: '${GEMINI_API_KEY}'
    },
    example_prompt: 'Generate content ideas for our blog about AI automation.'
  });
}

// Create directories
const directories = [
  path.join(rootDir, 'scripts'),
  path.join(rootDir, 'docs', 'mcp-examples')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Read and process templates
function processTemplate(templatePath, outputPath, variables) {
  let content = fs.readFileSync(templatePath, 'utf8');
  
  // Replace template variables
  content = content.replace(/{{PROJECT_NAME}}/g, variables.projectName);
  
  // Handle conditional sections
  if (variables.aiServices && variables.aiServices.length > 0) {
    content = content.replace(/{% if AI_SERVICES %}([\s\S]*?){% endif %}/g, '$1');
    
    // Handle AI services loops
    content = content.replace(
      /{% for service in AI_SERVICES %}([\s\S]*?){% endfor %}/g,
      (match, template) => {
        return variables.aiServices
          .map(service => {
            let result = template;
            for (const [key, value] of Object.entries(service)) {
              result = result.replace(
                new RegExp(`{{service\\.${key}}}`, 'g'),
                typeof value === 'object' ? JSON.stringify(value) : value
              );
            }
            return result;
          })
          .join('');
      }
    );
  } else {
    content = content.replace(/{% if AI_SERVICES %}[\s\S]*?{% endif %}/g, '');
  }
  
  // Handle TypeScript conditional
  if (variables.isTypeScript) {
    content = content.replace(/{% if TYPESCRIPT %}([\s\S]*?){% endif %}/g, '$1');
  } else {
    content = content.replace(/{% if TYPESCRIPT %}[\s\S]*?{% endif %}/g, '');
  }
  
  // Handle React conditional
  if (variables.isReact) {
    content = content.replace(/{% if REACT %}([\s\S]*?){% endif %}/g, '$1');
  } else {
    content = content.replace(/{% if REACT %}[\s\S]*?{% endif %}/g, '');
  }
  
  // Write the processed file
  fs.writeFileSync(outputPath, content);
  console.log(`Created file: ${outputPath}`);
}

// Process .mcp.json template
processTemplate(
  path.join(templatesDir, 'mcp.json.template'),
  path.join(rootDir, configFile),
  {
    projectName,
    aiServices,
    isTypeScript,
    isReact
  }
);

// Process setup script template
processTemplate(
  path.join(templatesDir, 'setup-mcp.js.template'),
  path.join(rootDir, 'scripts', 'setup-mcp.js'),
  {
    projectName,
    aiServices,
    isTypeScript,
    isReact
  }
);

// Process documentation template
processTemplate(
  path.join(templatesDir, 'MCP-INTEGRATION.md.template'),
  path.join(rootDir, 'docs', 'MCP-INTEGRATION.md'),
  {
    projectName,
    aiServices,
    isTypeScript,
    isReact
  }
);

// Create example MCP files
const exampleFiles = [
  {
    template: 'typescript-example.ts.template',
    output: 'docs/mcp-examples/typescript-example.ts'
  },
  {
    template: 'puppeteer-example.js.template',
    output: 'docs/mcp-examples/puppeteer-example.js'
  }
];

// Add AI service example if needed
if (aiServices.length > 0) {
  exampleFiles.push({
    template: 'ai-service-example.js.template',
    output: 'docs/mcp-examples/ai-service-example.js'
  });
}

// Process example files
exampleFiles.forEach(file => {
  processTemplate(
    path.join(templatesDir, file.template),
    path.join(rootDir, file.output),
    {
      projectName,
      aiServices,
      isTypeScript,
      isReact
    }
  );
});

// Make scripts executable
const scriptFiles = [
  path.join(rootDir, 'scripts', 'setup-mcp.js')
];

scriptFiles.forEach(file => {
  try {
    const currentMode = fs.statSync(file).mode;
    const executableMode = currentMode | 0o111; // Add executable permission
    fs.chmodSync(file, executableMode);
    console.log(`Made executable: ${file}`);
  } catch (error) {
    console.warn(`Warning: Could not make executable: ${file}`);
  }
});

// Update package.json with MCP scripts
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add MCP-related scripts
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['setup-mcp'] = 'node scripts/setup-mcp.js';
  packageJson.scripts['mcp-dev'] = 'claude --with all --cd .';
  packageJson.scripts['mcp-test'] = 'claude --with typescript,puppeteer,node --cd .';
  
  if (aiServices.some(s => s.name === 'gemini')) {
    packageJson.scripts['start:gemini-mcp'] = 'node scripts/create-gemini-mcp.js';
  }
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with MCP scripts');
} catch (error) {
  console.warn('Warning: Could not update package.json:', error.message);
}

console.log('\n✅ MCP configuration completed successfully!');
console.log('Run the setup script to install and configure MCP servers:');
console.log('npm run setup-mcp');