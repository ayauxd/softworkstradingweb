import express from 'express';
import { aiConfig } from '../config';

const router = express.Router();

/**
 * Demo Chat API Route
 * Safely proxies requests to OpenAI without exposing API keys to the client
 */
router.post('/chat', async (req, res) => {
  try {
    // Ensure OpenAI is configured
    if (!aiConfig.openai.isConfigured) {
      return res.status(500).json({
        error: 'OpenAI API is not configured on the server'
      });
    }
    
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }
    
    // Call OpenAI API using server-side key
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.openai.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a workflow automation agent for Softworks Trading Company. You help businesses implement AI solutions. Keep responses concise and practical.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return res.json({
      message: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in demo chat endpoint:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
});

export default router;