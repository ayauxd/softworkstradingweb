import fetch from 'node-fetch';

async function testDebugServer() {
  const BASE_URL = 'http://localhost:5002';
  
  console.log('Testing debug server with knowledge base queries...\n');
  
  // Test 1: General knowledge base query
  console.log('Test 1: General knowledge base query');
  try {
    const response = await fetch(`${BASE_URL}/api/test-knowledge?q=services`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✓ Response received for services query');
    console.log(`Found ${data.matchedServices.length} matching services`);
    
    if (data.matchedServices.length > 0) {
      console.log('\nExample service:');
      console.log(`- ${data.matchedServices[0].name}: ${data.matchedServices[0].description}`);
    }
  } catch (error) {
    console.error('✗ Test 1 failed:', error);
  }
  
  // Test 2: Healthcare industry query
  console.log('\nTest 2: Healthcare industry query');
  try {
    const response = await fetch(`${BASE_URL}/api/test-knowledge?q=healthcare`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✓ Response received for healthcare query');
    console.log(`Found ${data.matchedIndustries.length} matching industries`);
    
    if (data.matchedIndustries.length > 0) {
      console.log('\nHealthcare industry info:');
      const healthcare = data.matchedIndustries[0];
      console.log(`- Industry: ${healthcare.name}`);
      console.log('- Challenges:');
      healthcare.challenges.forEach(c => console.log(`  * ${c}`));
      console.log('- Solutions:');
      healthcare.solutions.forEach(s => console.log(`  * ${s}`));
    }
  } catch (error) {
    console.error('✗ Test 2 failed:', error);
  }
  
  // Test 3: Simulated chat request
  console.log('\nTest 3: Simulated chat request about healthcare');
  try {
    const response = await fetch(`${BASE_URL}/api/simulate-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'What services do you offer for healthcare companies?' })
    });
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✓ Chat response received');
    console.log('Source:', data.source);
    console.log('\nResponse:');
    console.log(data.text);
  } catch (error) {
    console.error('✗ Test 3 failed:', error);
  }
}

// Run the tests
console.log('Starting tests...');
testDebugServer().then(() => console.log('\nAll tests completed.'));