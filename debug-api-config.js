import fs from 'fs';
import path from 'path';

// Log server configuration
console.log("\nChecking server configuration...");

// Check for config.ts file
const configPath = path.join(process.cwd(), 'server', 'config.ts');
console.log(`Config file path: ${configPath}`);

try {
  const configExists = fs.existsSync(configPath);
  console.log(`Config file exists: ${configExists}`);
  
  if (configExists) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    console.log('\nConfig file content (redacted sensitive info):');
    
    // Extract API configuration (redacting actual keys)
    const openaiConfigMatch = configContent.match(/openai:\s*{[^}]+}/);
    if (openaiConfigMatch) {
      const openaiConfig = openaiConfigMatch[0].replace(/(apiKey:).*?(['"])[^'"]*\2/, '$1 "[REDACTED]"');
      console.log(`OpenAI config: ${openaiConfig}`);
      
      // Check if isConfigured property exists and is being set correctly
      const openaiIsConfiguredMatch = openaiConfig.match(/isConfigured:\s*(.*?)(?:,|\s})/);
      if (openaiIsConfiguredMatch) {
        console.log(`OpenAI isConfigured: ${openaiIsConfiguredMatch[1]}`);
      }
    } else {
      console.log("OpenAI config not found");
    }
    
    const elevenlabsConfigMatch = configContent.match(/elevenlabs:\s*{[^}]+}/);
    if (elevenlabsConfigMatch) {
      const elevenlabsConfig = elevenlabsConfigMatch[0].replace(/(apiKey:).*?(['"])[^'"]*\2/, '$1 "[REDACTED]"');
      console.log(`ElevenLabs config: ${elevenlabsConfig}`);
      
      // Check if isConfigured property exists and is being set correctly
      const elevenlabsIsConfiguredMatch = elevenlabsConfig.match(/isConfigured:\s*(.*?)(?:,|\s})/);
      if (elevenlabsIsConfiguredMatch) {
        console.log(`ElevenLabs isConfigured: ${elevenlabsIsConfiguredMatch[1]}`);
      }
    } else {
      console.log("ElevenLabs config not found");
    }
    
    const geminiConfigMatch = configContent.match(/gemini:\s*{[^}]+}/);
    if (geminiConfigMatch) {
      const geminiConfig = geminiConfigMatch[0].replace(/(apiKey:).*?(['"])[^'"]*\2/, '$1 "[REDACTED]"');
      console.log(`Gemini config: ${geminiConfig}`);
      
      // Check if isConfigured property exists and is being set correctly
      const geminiIsConfiguredMatch = geminiConfig.match(/isConfigured:\s*(.*?)(?:,|\s})/);
      if (geminiIsConfiguredMatch) {
        console.log(`Gemini isConfigured: ${geminiIsConfiguredMatch[1]}`);
      }
    } else {
      console.log("Gemini config not found");
    }
  }
} catch (error) {
  console.error(`Error checking config file: ${error.message}`);
}

// Check routes.ts to see if AI endpoints are registered
const routesPath = path.join(process.cwd(), 'server', 'routes.ts');
console.log(`\nRoutes file path: ${routesPath}`);

try {
  const routesExists = fs.existsSync(routesPath);
  console.log(`Routes file exists: ${routesExists}`);
  
  if (routesExists) {
    const routesContent = fs.readFileSync(routesPath, 'utf8');
    
    console.log('\nChecking for AI routes:');
    
    const aiRouteMatch = routesContent.match(/app\.use\(['"]\/api\/ai['"]/);
    console.log(`AI routes registered: ${!!aiRouteMatch}`);
    
    if (aiRouteMatch) {
      // Find which file the AI routes are imported from
      const aiRoutesImport = routesContent.match(/import\s+.*?ai.*?\s+from\s+['"](.+?)['"]/);
      if (aiRoutesImport) {
        console.log(`AI routes imported from: ${aiRoutesImport[1]}`);
        
        // Check if the AI routes file exists
        const aiRoutesPath = path.join(process.cwd(), 'server', `${aiRoutesImport[1]}.ts`.replace('./',''));
        const aiRoutesExists = fs.existsSync(aiRoutesPath);
        console.log(`AI routes file exists: ${aiRoutesExists}`);
        
        if (aiRoutesExists) {
          const aiRoutesContent = fs.readFileSync(aiRoutesPath, 'utf8');
          console.log('\nChecking AI endpoints:');
          
          const chatEndpointMatch = aiRoutesContent.match(/router\.post\(['"]\/chat['"]/);
          console.log(`Chat endpoint registered: ${!!chatEndpointMatch}`);
          
          const voiceEndpointMatch = aiRoutesContent.match(/router\.post\(['"]\/voice['"]/);
          console.log(`Voice endpoint registered: ${!!voiceEndpointMatch}`);
        }
      }
    }
  }
} catch (error) {
  console.error(`Error checking routes file: ${error.message}`);
}