# MCP Servers Usage Guide

This document provides instructions for using the MCP (Model Context Protocol) servers with Claude Code for the SoftworksTradingWeb project.

## What is MCP?

MCP (Model Context Protocol) is a standard interface that allows AI models like Claude to interact with your development environment, execute code, run tests, and perform other tasks through specialized servers.

## Available MCP Servers

The following MCP servers are configured for this project:

1. **TypeScript MCP** (`typescript`)
   - Execute TypeScript code snippets directly
   - Test TypeScript functions
   - Debug TypeScript types and interfaces

2. **Puppeteer MCP** (`puppeteer`)
   - Automate browser interactions
   - Take screenshots of web pages
   - Test responsive design across different viewports
   - Validate frontend UI

3. **Node MCP** (`node`)
   - Run Node.js scripts
   - Test server functionality
   - Execute JavaScript code

4. **React Tools MCP** (`react-tools`)
   - Analyze React components
   - Check component optimization opportunities
   - Test React component rendering

## Setting Up MCP Servers

All necessary MCP servers can be set up using the provided script:

```bash
npm run setup-mcp
```

This script will:
1. Install the required packages globally
2. Configure Claude to use these MCP servers
3. Display usage instructions

### Manual Setup

If you prefer to set up MCP servers manually:

1. Install the required packages:
   ```bash
   npm install -g puppeteer-mcp-server @modelcontextprotocol/sdk @dogtiti/vite-plugin-react-mcp
   ```

2. Configure each MCP server with Claude:
   ```bash
   claude mcp add typescript npx tsx
   claude mcp add puppeteer puppeteer-mcp-server
   claude mcp add node node
   claude mcp add react-tools npx -p @dogtiti/vite-plugin-react-mcp vite-plugin-react-mcp
   ```

## Using MCP Servers

### Starting Claude with MCP Servers

You can start Claude with one or multiple MCP servers:

```bash
# Use a single MCP server
claude --with typescript

# Use multiple MCP servers
claude --with typescript,puppeteer,node

# List available MCP servers
claude mcp list
```

### Example Usage

#### TypeScript MCP

```bash
claude --with typescript

> Execute this TypeScript function:
> 
> function calculateTotal(prices: number[]): number {
>   return prices.reduce((sum, price) => sum + price, 0);
> }
> 
> calculateTotal([10, 20, 30, 40]);
```

#### Puppeteer MCP

```bash
claude --with puppeteer

> Take a screenshot of my website at localhost:3000 and check if the layout works on mobile
```

#### Node MCP

```bash
claude --with node

> Test the API endpoint at /api/health and tell me if it's working correctly
```

#### React Tools MCP

```bash
claude --with react-tools

> Analyze the HeroSection component and suggest optimizations
```

## Using Multiple MCP Servers

When working on complex tasks, you can combine multiple MCP servers for more powerful workflows:

```bash
claude --with typescript,puppeteer,node

> Create a new component that displays data from our API, test it with sample data, and check how it renders in the browser
```

## Troubleshooting

If you encounter issues with MCP servers:

1. Check if the server is properly installed and configured:
   ```bash
   claude mcp list
   ```

2. Try removing and re-adding the server:
   ```bash
   claude mcp remove typescript
   claude mcp add typescript npx tsx
   ```

3. Check for error messages when launching Claude with the server:
   ```bash
   claude --with typescript --mcp-debug
   ```

4. Make sure you have the required packages installed globally:
   ```bash
   npm list -g puppeteer-mcp-server
   ```

For more information on MCP, refer to the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code).

## Extending MCP Configuration

To add or modify MCP servers for this project, edit the `.mcp.json` file in the root directory. This file is used for project-level MCP configuration that can be shared with other team members.