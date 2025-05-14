import http from 'http';

const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/',
  method: 'GET',
};

console.log(`Testing connection to http://localhost:9000/...`);

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`RESPONSE LENGTH: ${data.length} bytes`);
    console.log(`FIRST 200 CHARACTERS: ${data.substring(0, 200)}`);
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