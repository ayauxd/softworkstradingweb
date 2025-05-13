import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Controller for AI-related endpoints
 */
export const aiController = {
  /**
   * Process a chat message and return AI response
   */
  processChat: async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }
      
      const response = await aiService.sendChatMessage(message, conversationId);
      
      res.json({
        text: response.text,
        success: response.success,
        provider: response.provider,
        conversationId: response.conversationId || conversationId
      });
    } catch (error) {
      console.error('Error in processChat controller:', error);
      
      // Return a more detailed error message if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Return a graceful error response with the conversation ID preserved
      res.status(500).json({ 
        error: 'Failed to process chat message', 
        details: errorMessage,
        conversationId: conversationId, // Return the conversation ID even on error
        success: false
      });
    }
  },
  
  /**
   * Generate voice audio from text
   */
  generateVoice: async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, voiceId } = req.body;
      
      if (!text) {
        res.status(400).json({ error: 'Text is required' });
        return;
      }
      
      const response = await aiService.generateVoiceResponse(text, voiceId);
      
      if (!response.success || !response.audioData) {
        res.status(500).json({ error: 'Failed to generate voice audio' });
        return;
      }
      
      res.json({
        audioData: response.audioData,
        success: response.success,
        provider: response.provider
      });
    } catch (error) {
      console.error('Error in generateVoice controller:', error);
      
      // Return a more detailed error message if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      res.status(500).json({ 
        error: 'Failed to generate voice audio', 
        details: errorMessage,
        success: false,
        provider: 'none'
      });
    }
  },
  
  /**
   * Save call summary and send email
   */
  saveCallSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      const { summary, userEmail, timestamp } = req.body;
      
      if (!summary) {
        res.status(400).json({ error: 'Summary is required' });
        return;
      }
      
      // File path for call summary
      let filePath = '';
      
      // 1. Save to file log
      try {
        const logsDir = path.join(process.cwd(), 'logs');
        
        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logsDir)) {
          console.log('Creating logs directory at:', logsDir);
          fs.mkdirSync(logsDir, { recursive: true });
        }
        
        // Create a timestamped filename
        const date = new Date();
        const filename = `call_summary_${date.toISOString().replace(/[:.]/g, '-')}.txt`;
        filePath = path.join(logsDir, filename);
        
        // Format summary content
        const summaryContent = 
          `Timestamp: ${timestamp || date.toISOString()}\n` +
          `User Email: ${userEmail || 'Not provided'}\n\n` +
          summary;
        
        // Write summary to file
        fs.writeFileSync(filePath, summaryContent);
        console.log('Call summary saved to file:', filePath);
      } catch (fileError) {
        console.error('Error saving call summary to file:', fileError);
        // Continue to email sending even if file saving fails
      }
      
      // 2. Send email
      let emailSent = false;
      
      try {
        // Skip email sending in development mode unless explicitly configured
        if (process.env.NODE_ENV === 'development' && !process.env.FORCE_EMAIL_IN_DEV) {
          console.log('Email sending skipped in development mode');
          console.log('Would have sent email to:', process.env.CALL_SUMMARY_EMAIL || 'agents@softworkstrading.com');
        } else {
          // Create transport (configure based on your email provider)
          const emailConfig = {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Default to Gmail SMTP
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            }
          };
          
          // Fallback for test environment
          if (process.env.NODE_ENV === 'test') {
            console.log('Using test email configuration');
            // Create a test account if needed
            // In test environments, we just log instead of sending
          }
          
          // Check if email credentials are configured
          if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.warn('Email credentials not configured, skipping email sending');
          } else {
            console.log('Creating email transport with configured settings');
            const transporter = nodemailer.createTransport(emailConfig);
            
            // Send email
            await transporter.sendMail({
              from: process.env.EMAIL_FROM || 'noreply@softworkstrading.com',
              to: process.env.CALL_SUMMARY_EMAIL || 'agents@softworkstrading.com',
              subject: `Call Summary - ${new Date().toLocaleString()}`,
              text: 
                `A new call summary has been generated.\n\n` +
                `Timestamp: ${timestamp || new Date().toISOString()}\n` +
                `User Email: ${userEmail || 'Not provided'}\n\n` +
                summary
            });
            
            console.log('Email sent successfully');
            emailSent = true;
          }
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue even if email fails - we've already logged to file
      }
      
      // Return success response
      res.json({
        success: true,
        emailSent,
        filePath: filePath || null,
        message: emailSent 
          ? 'Call summary saved and email sent' 
          : 'Call summary saved but email could not be sent'
      });
    } catch (error) {
      console.error('Error in saveCallSummary controller:', error);
      
      // Return a more detailed error message if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      res.status(500).json({ 
        error: 'Failed to save call summary', 
        details: errorMessage,
        success: false
      });
    }
  }
};