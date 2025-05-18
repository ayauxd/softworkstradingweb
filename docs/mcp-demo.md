# MCP Server Demonstrations for SoftworksTradingWeb

This document provides examples of how to use the MCP servers you've installed with Claude to enhance your development workflow.

## 1. Desktop Commander MCP

The Desktop Commander MCP gives Claude file system access and terminal capabilities.

Examples:
```
# Start Claude with the Desktop Commander MCP
claude --with desktop-commander

# Ask Claude to list project files
> Show me the most recently modified files in this project

# Ask Claude to find specific code
> Find all React components that use the ThemeProvider

# Ask Claude to modify files
> Update the Footer component to include the current year in the copyright notice
```

## 2. TypeScript MCP

The TypeScript MCP lets Claude execute TypeScript code snippets directly.

Examples:
```
# Start Claude with the TypeScript MCP
claude --with typescript

# Ask Claude to test a TypeScript function
> Execute the findUserById function from typescript-mcp-test.ts with id 2

# Ask Claude to transform data
> Parse the users array from typescript-mcp-test.ts and format it as a markdown table
```

## 3. Puppeteer MCP

The Puppeteer MCP enables Claude to control a web browser for testing and automation.

Examples:
```
# Start Claude with the Puppeteer MCP
claude --with puppeteer

# Ask Claude to test your website
> Open my website at localhost:3000 and take a screenshot

# Ask Claude to check responsive design
> Test my website at mobile, tablet, and desktop resolutions
```

## 4. React Tools MCP

The React Tools MCP helps with React component testing and visualization.

Examples:
```
# Start Claude with the React Tools MCP
claude --with react-tools

# Ask Claude to analyze a component
> Analyze the HeroSection component and suggest performance improvements

# Ask Claude to test a component with different props
> Render the ContactSection component with test data
```

## 5. Node MCP

The Node MCP lets Claude run Node.js scripts and interact with your Express backend.

Examples:
```
# Start Claude with the Node MCP
claude --with node

# Ask Claude to test an API endpoint
> Test the /api/contact endpoint with sample form data

# Ask Claude to analyze server logs
> Parse the server logs and identify any error patterns
```

## 6. Database MCP

The Database MCP gives Claude access to your database for queries and schema analysis.

Examples:
```
# Start Claude with the Database MCP
claude --with db

# Ask Claude to analyze your database schema
> Show me the database schema and suggest optimizations

# Ask Claude to write a complex query
> Write a query to find all users who registered in the last month
```

## 7. Browser MCP

The Browser MCP (using Playwright) gives Claude an alternative browser automation tool.

Examples:
```
# Start Claude with the Browser MCP
claude --with browser

# Ask Claude to test user flows
> Test the sign-up flow and report any issues

# Ask Claude to extract data
> Visit our competitors' websites and extract their pricing information
```

## Using Multiple MCP Servers

You can combine multiple MCP servers for more powerful workflows:

```
# Start Claude with multiple MCP servers
claude --with typescript,puppeteer,node

# Ask Claude for complex tasks
> Create a new React component that displays real-time data from our API, test it in the browser, and add it to the home page
```