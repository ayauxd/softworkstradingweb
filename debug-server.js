import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors'; // for cross-origin requests

// Create a basic Express server to test the knowledge base
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files from the current directory
app.use(express.static(process.cwd()));

// Load the knowledge base
try {
  console.log('Loading knowledge base files...');
  
  // Load company info
  const companyInfoPath = path.join(process.cwd(), 'server', 'knowledge', 'companyInfo.json');
  const companyInfo = JSON.parse(fs.readFileSync(companyInfoPath, 'utf8'));
  console.log('✓ Loaded company info');
  
  // Load FAQs
  const faqsPath = path.join(process.cwd(), 'server', 'knowledge', 'faqs.json');
  const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
  console.log('✓ Loaded FAQs');
  
  // Create a simple endpoint to test the knowledge base
  app.get('/api/test-knowledge', (req, res) => {
    const query = req.query.q || '';
    
    // Find related information based on the query
    const results = {
      query,
      companyInfo: {
        name: companyInfo.company.name,
        description: companyInfo.company.description,
        industries: companyInfo.company.industries_served
      },
      matchedServices: [],
      matchedFAQs: [],
      matchedIndustries: []
    };
    
    // Search for relevant services
    if (companyInfo.services) {
      results.matchedServices = companyInfo.services
        .filter(service => 
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase())
        )
        .map(service => ({
          name: service.name,
          description: service.description
        }));
    }
    
    // Search for relevant FAQs
    if (faqs.general_faqs) {
      results.matchedFAQs = faqs.general_faqs
        .filter(faq => 
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
        )
        .map(faq => ({
          question: faq.question,
          answer: faq.answer
        }));
    }
    
    // Search for industry-specific information
    if (companyInfo.industries) {
      results.matchedIndustries = companyInfo.industries
        .filter(industry => 
          industry.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(industry => ({
          name: industry.name,
          challenges: industry.challenges,
          solutions: industry.solutions
        }));
    }
    
    res.json(results);
  });
  
  // Create a simulated chat endpoint that uses the knowledge base
  app.post('/api/simulate-chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // This is a simplified simulation of how the AI would use the knowledge base
    let response = `As an AI assistant for ${companyInfo.company.name}, I can provide information about our services and expertise.`;
    
    // Check for industry-specific questions
    const industries = companyInfo.industries || [];
    for (const industry of industries) {
      if (message.toLowerCase().includes(industry.name.toLowerCase())) {
        response = `For ${industry.name} clients, we understand your key challenges include: ${industry.challenges.join(', ')}. Our solutions for these challenges include: ${industry.solutions.join(', ')}. `;
        
        // Add case study reference if available
        if (industry.case_study_ref) {
          response += `We have a case study demonstrating our success in this industry: "${industry.case_study_ref}".`;
        }
        
        return res.json({ 
          text: response,
          success: true,
          source: 'knowledge_base_industries'
        });
      }
    }
    
    // Check for service-specific questions
    const services = companyInfo.services || [];
    for (const service of services) {
      if (message.toLowerCase().includes(service.name.toLowerCase())) {
        response = `Our ${service.name} service helps you ${service.description} Key features include: ${service.details.join(', ')}. `;
        
        if (service.benefits) {
          response += `Benefits include: ${service.benefits.join(', ')}. `;
        }
        
        return res.json({ 
          text: response,
          success: true,
          source: 'knowledge_base_services'
        });
      }
    }
    
    // Check for FAQ matches
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
        return res.json({ 
          text: faq.answer,
          success: true,
          source: 'knowledge_base_faqs'
        });
      }
    }
    
    // Generic fallback response
    return res.json({ 
      text: `${response} I'd be happy to provide more specific information about our services, industries we serve, or answer any questions you have about how we can help your business.`,
      success: true,
      source: 'knowledge_base_fallback'
    });
  });
  
} catch (error) {
  console.error('Error loading knowledge base:', error);
  app.use('/api/test-knowledge', (req, res) => {
    res.status(500).json({ 
      error: 'Failed to load knowledge base',
      details: error.message
    });
  });
}

// Add a route to serve the chat interface
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'chat-interface.html'));
});

// Start the server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Debug server running at http://localhost:${PORT}`);
  console.log(`Chat interface available at: http://localhost:${PORT}/`);
  console.log(`Test knowledge base at: http://localhost:${PORT}/api/test-knowledge?q=healthcare`);
  console.log(`Simulate chat at: http://localhost:${PORT}/api/simulate-chat (POST with {"message": "..."})`);
});