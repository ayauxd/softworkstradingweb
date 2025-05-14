// React MCP Test for SoftworksTradingWeb

import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';

// This file demonstrates how you can use the React MCP to:
// 1. Inspect component structures
// 2. Test React component rendering
// 3. Debug React component props and state

// Sample component to test
function ExampleComponent({ title, description }) {
  return (
    <div className="example-component">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={() => console.log('Button clicked!')}>
        Click Me
      </button>
    </div>
  );
}

// Main function to render the component
function renderTestComponent() {
  // Create a div to mount our component
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  
  // Create root and render component
  const root = createRoot(mountNode);
  
  // Render our test component
  root.render(
    <ExampleComponent 
      title="MCP Test Component" 
      description="This component was rendered using the React MCP tools"
    />
  );
  
  console.log('Component mounted successfully!');
}

// Export for use with MCP
export { ExampleComponent, renderTestComponent };

// When run directly
console.log('React MCP test file loaded - use MCP to interact with the components');