import { createServer } from 'http';
import { networkInterfaces } from 'os';

// Get network interfaces
const nets = networkInterfaces();
console.log('Available network interfaces:');
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`  - ${name}: ${net.address}`);
    }
  }
}

// Create a simple test server
const port = 7000;
const server = createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server working!');
});

// Listen on all interfaces
server.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${port}/`);
  console.log(`Also available at:`);
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  - http://${net.address}:${port}/`);
      }
    }
  }
});