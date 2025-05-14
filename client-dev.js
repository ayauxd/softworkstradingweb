import { createServer } from 'vite';

// Create a Vite development server
async function startServer() {
  const server = await createServer({
    // Configure Vite
    root: './client',
    server: {
      port: 3000,
      open: false
    }
  });
  
  // Start the server
  await server.listen();
  
  console.log(`Vite dev server running at: ${server.resolvedUrls.local[0]}`);
}

startServer();