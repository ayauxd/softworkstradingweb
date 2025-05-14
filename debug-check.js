import fetch from 'node-fetch';

// Key assets to check
const assetsToCheck = [
  'http://localhost:8080',
  'http://localhost:8080/assets/index-CSv9mtEd.js',
  'http://localhost:8080/assets/vendor-BQQUTn4d.js',
  'http://localhost:8080/assets/index-D_iFD9vf.css',
  'http://localhost:8080/assets/logo.png',
  'http://localhost:8080/assets/logo-white.svg'
];

async function checkAssets() {
  console.log('Checking website assets...');
  
  for (const url of assetsToCheck) {
    try {
      const response = await fetch(url);
      console.log(`${url} - Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        const contentType = response.headers.get('content-type');
        console.log(`  Content-Type: ${contentType}`);
        
        if (url === 'http://localhost:3000') {
          const text = await response.text();
          console.log(`  Length: ${text.length} bytes`);
          console.log(`  First 100 chars: ${text.substring(0, 100)}`);
        }
      }
    } catch (error) {
      console.error(`Error checking ${url}:`, error.message);
    }
  }
}

checkAssets();