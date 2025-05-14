// Simple Express server for chat demo
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5002;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Serve static HTML
app.use(express.static(__dirname));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-chat.html'));
});

// Example knowledge base
const knowledgeBase = {
  'company': {
    'name': 'Softworks Trading Company',
    'description': 'An AI solutions provider for businesses',
    'contact': 'contact@softworkstrading.com'
  },
  'services': [
    {
      'name': 'AI Automation',
      'description': 'Automate repetitive tasks using AI'
    },
    {
      'name': 'Workflow Optimization',
      'description': 'Improve business processes with AI'
    },
    {
      'name': 'Data Analysis',
      'description': 'Extract insights from your business data'
    }
  ]
};

// Simple chat endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  let response = '';
  
  // Simple response logic
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    response = 'Hello! How can I help you today?';
  }
  else if (message.toLowerCase().includes('service')) {
    response = `We offer services including: ${knowledgeBase.services.map(s => s.name).join(', ')}. Would you like to know more about any specific service?`;
  }
  else if (message.toLowerCase().includes('contact')) {
    response = `You can contact us at ${knowledgeBase.company.contact}`;
  }
  else if (message.toLowerCase().includes('about')) {
    response = `${knowledgeBase.company.name} is ${knowledgeBase.company.description}`;
  }
  else {
    response = "I understand you're interested in our AI solutions. Could you tell me more about your specific needs so I can provide tailored information?";
  }
  
  // Add a slight delay to simulate processing
  setTimeout(() => {
    res.json({ text: response });
  }, 500);
});

// Voice endpoint (simulated)
app.post('/api/voice', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  console.log(`Generating voice for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
  
  // Simulated voice response
  res.json({
    audioData: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
    success: true
  });
});

// Start server
app.listen(port, () => {
  console.log(`Simple chat server running on http://localhost:${port}`);
  console.log(`Chat interface available at: http://localhost:${port}/`);
});