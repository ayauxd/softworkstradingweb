import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a basic Express server to test the knowledge base
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files from the current directory
app.use(express.static(__dirname));

// Create a simple status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Load the knowledge base
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

// Conversation management
const conversations = {};

// Create a simulated chat endpoint that uses the knowledge base
app.post('/api/simulate-chat', (req, res) => {
  const { message } = req.body;
  const clientIp = req.ip || 'anonymous';
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    // Initialize conversation for this client if it doesn't exist
    if (!conversations[clientIp]) {
      conversations[clientIp] = {
        messageCount: 0,
        lastQuery: '',
        lastResponseType: ''
      };
    }
    
    const conversation = conversations[clientIp];
    conversation.messageCount++;
    
    // Detect greeting or simple messages
    const isGreeting = /^(hi|hello|hey|greetings|howdy|hola)/i.test(message);
    const isSimpleQuestion = /^(how are you|who are you|what can you do|help me)/i.test(message);
    const isContactRequest = /(contact|email|phone|reach you|get in touch)/i.test(message);
    
    // Prevent repeating the same generic response
    const isRepeatQuery = conversation.lastQuery.toLowerCase() === message.toLowerCase();
    
    if (isGreeting && conversation.messageCount <= 2) {
      return res.json({
        text: "Hello! I'm glad you reached out. I can help with AI adoption strategies for your family business. What specific challenges are you facing that I could assist with?",
        success: true
      });
    } else if (isSimpleQuestion) {
      return res.json({
        text: "I'm an AI assistant for Softworks Trading Company, focused on helping businesses implement practical AI solutions. I can advise on automation, workflow optimization, and digital transformation tailored to your needs. What specific area would you like help with?",
        success: true
      });
    } else if (isContactRequest) {
      return res.json({
        text: "You can contact our team at contact@softworkstrading.com or call us at (555) 123-4567. We also offer free 30-minute consultations that you can schedule directly on our website.",
        success: true
      });
    }
    
    // This is a simplified simulation of how the AI would use the knowledge base
    let response = '';
    let responseType = 'custom';
    
    // Check for industry-specific questions
    const industries = companyInfo.industries || [];
    for (const industry of industries) {
      if (message.toLowerCase().includes(industry.name.toLowerCase())) {
        response = `For ${industry.name} clients like yours, we typically address challenges such as ${industry.challenges.join(', ')}. We've developed specific approaches that include ${industry.solutions.join(', ')}.`;
        
        // Add case study reference if available
        if (industry.case_study_ref) {
          response += ` One success story you might find relevant is our case study: "${industry.case_study_ref}".`;
        }
        
        responseType = 'industry';
        break;
      }
    }
    
    // Check for service-specific questions
    if (!response) {
      const services = companyInfo.services || [];
      for (const service of services) {
        if (message.toLowerCase().includes(service.name.toLowerCase())) {
          response = `Our ${service.name} service is designed to ${service.description} We focus on: ${service.details.join(', ')}.`;
          
          if (service.benefits) {
            response += ` Clients typically see benefits like ${service.benefits.join(', ')}.`;
          }
          
          responseType = 'service';
          break;
        }
      }
    }
    
    // Check for FAQ matches
    if (!response) {
      const allFaqs = [
        ...(faqs.general_faqs || []),
        ...(faqs.service_faqs || []),
        ...(faqs.technical_faqs || [])
      ];
      
      for (const faq of allFaqs) {
        // Simple keyword matching
        const questionWords = faq.question.toLowerCase().split(' ');
        const messageWords = message.toLowerCase().split(' ');
        
        const matchingWords = questionWords.filter(word => 
          word.length > 3 && messageWords.includes(word)
        );
        
        if (matchingWords.length >= 2) {
          response = faq.answer;
          responseType = 'faq';
          break;
        }
      }
    }
    
    // If about family business or AI adoption
    if (!response && (message.toLowerCase().includes('family business') || message.toLowerCase().includes('ai adoption'))) {
      response = "For family businesses looking to adopt AI, we recommend starting small with specific processes that cause bottlenecks. We can help identify 'quick wins' that demonstrate value without disrupting your established operations. Many of our family business clients start with customer service automation or inventory management tools that integrate with existing systems.";
      responseType = 'family_business';
    }
    
    // Generic fallback responses - with variety to avoid repetition
    if (!response) {
      const fallbacks = [
        "I'd be happy to help with that. Could you share more details about your specific business needs so I can provide tailored information?",
        "That's an interesting question. To better assist you, could you tell me more about what aspects of your business you're looking to improve?",
        "I understand you're interested in this area. To give you the most relevant information, could you share what specific challenges you're facing?",
        "Thanks for your question. To provide the most helpful response, could you tell me a bit more about your current business processes?",
        "I'd like to help with that. Could you provide a bit more context about your business situation so I can offer more specific guidance?"
      ];
      
      // Avoid repeating the same fallback message
      let fallbackIndex = conversation.messageCount % fallbacks.length;
      if (isRepeatQuery && conversation.lastResponseType === 'fallback') {
        fallbackIndex = (fallbackIndex + 1) % fallbacks.length;
      }
      
      response = fallbacks[fallbackIndex];
      responseType = 'fallback';
    }
    
    // Update conversation tracking
    conversation.lastQuery = message;
    conversation.lastResponseType = responseType;
    
    return res.json({ 
      text: response,
      success: true
    });
  } catch (error) {
    console.error('Error in chat simulation:', error);
    return res.status(500).json({ 
      error: 'Error processing chat request',
      details: error.message
    });
  }
});

// Create a voice generation endpoint
app.post('/api/generate-voice', (req, res) => {
  const { text, voiceId = 'default' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  try {
    // In a real implementation, this would call a voice generation API
    // For the demo, we'll just return a base64 encoded dummy audio file or a data URL
    
    // Simulate processing time
    console.log(`Generating voice for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // Create a dummy audio response - this is just to simulate the API
    // In real implementation, this would be actual audio data from an API
    const dummyAudioDataUrl = "data:audio/mp3;base64,AAAAHGZ0eXBNNEEgAAAAAE00QSBtcDQyaXNvbQAAAAFtZGF0AAAAAAAAeFgXgQAB//54ASxjb20uYXBwbGUuQ29tcm9lZnx4XgDAAU7AgAAEkAFNDAAAAAR4XgHDAAAAAAAAAAAAAAPGVABEREREREdAAAAAAHheAMMDxlQAREREREREQAAAAAB4XgDAAU7AgAAEkAFNDAAAAAR4XgHDAAAAAAAAAAAAAAPGVABFMTMuMzI4AAAAAAB4XgDAAU7AgAAEkAFNDAAAAAR4XgHDAAAAAAAAAAAAAAPGVABVOC4wMDAhQQAAAAAA";
    
    return res.json({
      audioData: dummyAudioDataUrl,
      success: true,
      provider: 'debug-server-simulation'
    });
  } catch (error) {
    console.error('Error generating voice:', error);
    return res.status(500).json({ 
      error: 'Error generating voice',
      details: error.message,
      success: false
    });
  }
});

// Add a route to serve the chat interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-interface-voice.html'));
});

// Start the server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Debug server with voice running at http://localhost:${PORT}`);
  console.log(`Chat interface available at: http://localhost:${PORT}/`);
  console.log(`Simulate chat at: http://localhost:${PORT}/api/simulate-chat (POST with {"message": "..."})`);
  console.log(`Generate voice at: http://localhost:${PORT}/api/generate-voice (POST with {"text": "..."})`);
});