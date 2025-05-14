import http from 'http';

const options = {
  hostname: '192.168.1.135',
  port: 7000,
  path: '/',
  method: 'GET',
};

console.log(`Testing connection to http://localhost:7000/...`);

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`RESPONSE: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`PROBLEM: ${e.message}`);
});

req.on('timeout', () => {
  console.error(`REQUEST TIMED OUT`);
  req.destroy();
});

req.setTimeout(5000);
req.end();