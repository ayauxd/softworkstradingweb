#!/usr/bin/env node

/**
 * Google Gemini MCP Server
 * 
 * This script creates a simple MCP server for Google Gemini using mcp-framework.
 * It allows Claude to interact with Gemini's capabilities.
 */

import { createMCPServer } from 'mcp-framework';
import { GoogleGenerativeAI } from '@google/genai';

// Configuration
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini client
const gemini = new GoogleGenerativeAI(API_KEY);

// Create and start MCP server
const server = createMCPServer({
  name: 'gemini-mcp-server',
  description: 'Model Context Protocol server for Google Gemini',
  version: '1.0.0',
  
  // Define tools
  tools: [
    {
      name: 'gemini-chat',
      description: 'Send a message to Google Gemini and get a response',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The message to send to Gemini',
          },
          history: {
            type: 'array',
            description: 'Optional chat history',
            items: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                  enum: ['user', 'model'],
                  description: 'The role of the message sender',
                },
                content: {
                  type: 'string',
                  description: 'The content of the message',
                },
              },
              required: ['role', 'content'],
            },
          },
        },
        required: ['message'],
      },
      handler: async ({ message, history = [] }) => {
        try {
          if (!API_KEY) {
            return {
              error: 'GEMINI_API_KEY not configured. Please set the environment variable.',
            };
          }

          // Get Gemini Pro model
          const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
          
          // Format history for Gemini chat
          const formattedHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          }));
          
          // Create chat session
          const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 0.8,
              maxOutputTokens: 1000,
            },
          });
          
          // Generate response
          const result = await chat.sendMessage(message);
          const response = result.response;
          
          return {
            text: response.text(),
            safetyRatings: response.safetyRatings || [],
          };
        } catch (error) {
          return {
            error: `Error in Gemini chat: ${error.message}`,
            details: error.toString(),
          };
        }
      },
    },
    
    {
      name: 'gemini-generate',
      description: 'Generate content using Google Gemini without maintaining chat history',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'The prompt to send to Gemini',
          },
          temperature: {
            type: 'number',
            description: 'Temperature for generation (0.0 to 1.0)',
            default: 0.7,
          },
          maxOutputTokens: {
            type: 'number',
            description: 'Maximum tokens to generate',
            default: 1000,
          },
        },
        required: ['prompt'],
      },
      handler: async ({ prompt, temperature = 0.7, maxOutputTokens = 1000 }) => {
        try {
          if (!API_KEY) {
            return {
              error: 'GEMINI_API_KEY not configured. Please set the environment variable.',
            };
          }

          // Get Gemini Pro model
          const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
          
          // Generate content
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              topK: 1,
              topP: 0.8,
              maxOutputTokens,
            },
          });
          
          const response = result.response;
          
          return {
            text: response.text(),
            safetyRatings: response.safetyRatings || [],
          };
        } catch (error) {
          return {
            error: `Error in Gemini generation: ${error.message}`,
            details: error.toString(),
          };
        }
      },
    },

    {
      name: 'gemini-vision',
      description: 'Send text and images to Google Gemini Vision and get a response',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string', 
            description: 'Text prompt to include with the image',
          },
          imageUrl: {
            type: 'string',
            description: 'URL of the image to analyze',
          },
          imageBase64: {
            type: 'string',
            description: 'Base64-encoded image data (alternative to imageUrl)',
          },
        },
        required: ['text'],
      },
      handler: async ({ text, imageUrl, imageBase64 }) => {
        try {
          if (!API_KEY) {
            return {
              error: 'GEMINI_API_KEY not configured. Please set the environment variable.',
            };
          }

          if (!imageUrl && !imageBase64) {
            return {
              error: 'Either imageUrl or imageBase64 must be provided',
            };
          }

          // Get Gemini Vision model
          const model = gemini.getGenerativeModel({ model: 'gemini-pro-vision' });
          
          // Prepare image part
          let imagePart;
          if (imageUrl) {
            // Fetch image data from URL
            const response = await fetch(imageUrl);
            const imageData = await response.arrayBuffer();
            imagePart = {
              inlineData: {
                data: Buffer.from(imageData).toString('base64'),
                mimeType: response.headers.get('content-type') || 'image/jpeg',
              },
            };
          } else if (imageBase64) {
            // Use provided base64 data
            imagePart = {
              inlineData: {
                data: imageBase64,
                mimeType: 'image/jpeg', // Assume JPEG if not specified
              },
            };
          }
          
          // Generate content with image
          const result = await model.generateContent({
            contents: [
              {
                role: 'user',
                parts: [
                  { text },
                  imagePart,
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1,
              maxOutputTokens: 2048,
            },
          });
          
          const response = result.response;
          
          return {
            text: response.text(),
            safetyRatings: response.safetyRatings || [],
          };
        } catch (error) {
          return {
            error: `Error in Gemini Vision: ${error.message}`,
            details: error.toString(),
          };
        }
      },
    },
  ],
});

// Start the server
server.listen(PORT, () => {
  console.log(`Gemini MCP server running on port ${PORT}`);
  console.log(`Server ID: ${server.id}`);
});