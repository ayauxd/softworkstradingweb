import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Load knowledge base
let companyInfo;
let faqs;

try {
  console.log('Loading knowledge base files...');
  
  // Load company info
  const companyInfoPath = path.join(__dirname, 'server', 'knowledge', 'companyInfo.json');
  companyInfo = JSON.parse(fs.readFileSync(companyInfoPath, 'utf8'));
  console.log('✓ Loaded company info');
  
  // Load FAQs
  const faqsPath = path.join(__dirname, 'server', 'knowledge', 'faqs.json');
  faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
  console.log('✓ Loaded FAQs');
} catch (error) {
  console.error('Error loading knowledge base:', error);
  companyInfo = { company: { name: 'Softworks Trading Company', description: 'AI Solutions' }, services: [], industries: [] };
  faqs = { general_faqs: [], service_faqs: [], technical_faqs: [] };
}

// Mock CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: 'test-csrf-token-12345' });
});

// Implement the chat API endpoint that the front-end expects
app.post('/api/ai/chat', (req, res) => {
  const { message, conversationId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  console.log(`Received chat message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);
  
  // Process the message using knowledge base
  let responseText = '';
  
  // Simple response logic based on content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    responseText = 'Hello! How can I help you with our AI solutions today?';
  }
  else if (message.toLowerCase().includes('service')) {
    const services = companyInfo.services || [];
    if (services.length > 0) {
      responseText = `We offer these services: ${services.map(s => s.name).join(', ')}. Which one would you like to know more about?`;
    } else {
      responseText = 'We offer various AI services tailored to business needs. What specific area are you interested in?';
    }
  }
  else if (message.toLowerCase().includes('contact')) {
    responseText = 'You can contact our team at contact@softworkstrading.com or call us at (555) 123-4567.';
  }
  else {
    // Check for industry-specific questions
    const industries = companyInfo.industries || [];
    for (const industry of industries) {
      if (message.toLowerCase().includes(industry.name.toLowerCase())) {
        responseText = `For ${industry.name} clients, we understand your key challenges include: ${industry.challenges.join(', ')}. Our solutions for these challenges include: ${industry.solutions.join(', ')}.`;
        break;
      }
    }
    
    // If no industry match, use a generic response
    if (!responseText) {
      responseText = `As an AI assistant for ${companyInfo.company.name}, I can provide information about our services and expertise. I'd be happy to provide more specific information about our services, industries we serve, or answer any questions you have about how we can help your business.`;
    }
  }
  
  // Return in the format expected by the frontend
  res.json({
    text: responseText,
    success: true,
    provider: 'integrated-server',
    conversationId: conversationId || 'new-conversation-123'
  });
});

// Implement the voice API endpoint
app.post('/api/ai/voice', (req, res) => {
  const { text, voiceId } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  console.log(`Generating voice for: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
  
  // This is a dummy base64 audio data - in a real implementation, this would be generated
  // from a text-to-speech service. This is just a very short audio sample to demonstrate.
  const dummyAudioData = "data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU29mdHdvcmtzIFRyYWRpbmcgQ29tcGFueQAAAP/+7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAGhQC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABSAJAJAQgAAgAAAAoXydUsPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  // Return in the format expected by the frontend
  res.json({
    audioData: dummyAudioData,
    success: true,
    provider: 'integrated-server'
  });
});

// Start server
const PORT = 3000; // Standard port with better compatibility
const HOST = '127.0.0.1'; // Use IP instead of hostname

app.listen(PORT, HOST, () => {
  console.log(`Integrated server running at http://${HOST}:${PORT}`);
  console.log(`Chat API available at: http://${HOST}:${PORT}/api/ai/chat`);
  console.log(`Voice API available at: http://${HOST}:${PORT}/api/ai/voice`);
  console.log(`CSRF token endpoint at: http://${HOST}:${PORT}/api/csrf-token`);
  console.log('\nTo test in browser, use these exact URLs with IP instead of localhost');
});