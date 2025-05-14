#!/usr/bin/env node

/**
 * MCP Server Setup Script for SoftworksTradingWeb
 * 
 * This script installs and configures the necessary MCP servers for
 * development and testing with Claude Code.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const mcpConfigPath = path.join(rootDir, '.mcp.json');

console.log('📦 Setting up MCP servers for SoftworksTradingWeb');

// Required packages for MCP servers
const requiredPackages = [
  'puppeteer-mcp-server',
  '@modelcontextprotocol/sdk',
  '@dogtiti/vite-plugin-react-mcp',
  '@angelogiacco/elevenlabs-mcp-server',
  'openai-mcp-server',
  '@google/genai',
  'mcp-framework'
];

function installPackages() {
  console.log('\n📥 Installing required packages...');
  
  try {
    execSync(`npm install -g ${requiredPackages.join(' ')}`, { 
      stdio: 'inherit',
      cwd: rootDir
    });
    console.log('✅ Packages installed successfully');
  } catch (error) {
    console.error('❌ Failed to install packages:', error.message);
    process.exit(1);
  }
}

function configureMcpServers() {
  console.log('\n🔧 Configuring MCP servers with Claude...');
  
  try {
    // Read the MCP config
    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    
    // Configure each MCP server with Claude
    for (const server of mcpConfig.servers) {
      console.log(`  Setting up ${server.name} MCP server...`);
      
      try {
        execSync(`claude mcp add ${server.name} ${server.command}`, {
          stdio: 'inherit',
          cwd: rootDir
        });
      } catch (error) {
        console.warn(`⚠️ Warning: Failed to add ${server.name} MCP server:`, error.message);
        console.log('  You can manually add it with:');
        console.log(`  claude mcp add ${server.name} ${server.command}`);
      }
    }
    
    console.log('✅ MCP servers configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure MCP servers:', error.message);
    console.log('You can manually configure MCP servers with:');
    console.log('claude mcp add <name> <command>');
  }
}

function displayUsageInstructions() {
  console.log('\n📚 MCP Usage Instructions:');
  console.log('1. Start Claude with MCP servers:');
  console.log('   claude --with typescript,puppeteer,node');
  console.log('2. Use Claude with single MCP server:');
  console.log('   claude --with puppeteer');
  console.log('\n🌟 All set! MCP servers are ready to use.');
}

// Main execution
try {
  installPackages();
  configureMcpServers();
  displayUsageInstructions();
} catch (error) {
  console.error('❌ Error setting up MCP servers:', error.message);
  process.exit(1);
}