import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/**
 * Email Service - Handles sending emails via SMTP
 */
class EmailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean = false;
  private contactEmail: string;

  constructor() {
    // Initialize the service
    this.initialize();
    
    // Set default contact email
    this.contactEmail = process.env.CONTACT_EMAIL || 'info@softworkstrading.com';
  }

  /**
   * Initialize the email service with configuration from environment variables
   */
  private initialize() {
    try {
      // Check if SMTP configuration is available
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        logger.warn('Email service not configured: Missing SMTP configuration');
        this.isConfigured = false;
        return;
      }

      // Create a transporter with the configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      logger.info('Email service initialized with SMTP configuration');
      this.isConfigured = true;
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send a contact form submission email
   */
  async sendContactFormEmail(formData: {
    fullName: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
  }): Promise<boolean> {
    if (!this.isConfigured) {
      logger.warn('Contact form email not sent: Email service not configured');
      return false;
    }

    try {
      const { fullName, email, company, phone, message } = formData;
      
      // Create HTML content for the email
      const htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <h3>Message:</h3>
        <p>${message.replace(/\\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from the contact form on softworkstrading.com</small></p>
      `;

      // Send the email
      const info = await this.transporter.sendMail({
        from: `"Softworks Trading Contact Form" <${process.env.SMTP_USER}>`,
        to: this.contactEmail,
        replyTo: email,
        subject: `New Contact Form Submission from ${fullName}`,
        text: `New Contact Form Submission\n\nFrom: ${fullName} (${email})\n${
          company ? `Company: ${company}\n` : ''
        }${phone ? `Phone: ${phone}\n` : ''}\nMessage:\n${message}\n\nThis message was sent from the contact form on softworkstrading.com`,
        html: htmlContent,
      });

      logger.info(`Contact form email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send contact form email:', error);
      return false;
    }
  }

  /**
   * Send a general email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      logger.warn('Email not sent: Email service not configured');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Softworks Trading" <${process.env.SMTP_USER}>`,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Get configuration status
   */
  getStatus(): { configured: boolean; contactEmail: string } {
    return {
      configured: this.isConfigured,
      contactEmail: this.contactEmail,
    };
  }
}

// Create a singleton instance
export const emailService = new EmailService();