import { validate, sanitize, defaultSanitizer, validateAndSanitize } from '../../../server/middleware/validation';
import { contactFormSchema, subscriptionSchema } from '../../../server/schemas/api';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';

describe('Validation Middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('validate middleware', () => {
    const testSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      age: z.number().min(18).optional(),
    });

    beforeEach(() => {
      app.post('/test', validate(testSchema), (req, res) => {
        res.json({ success: true, data: req.body });
      });
    });

    test('should pass valid data through', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      };

      const response = await request(app)
        .post('/test')
        .send(validData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: validData,
      });
    });

    test('should return 400 for invalid data', async () => {
      const invalidData = {
        name: 'J', // Too short
        email: 'not-an-email',
        age: 15, // Too young
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(3);
    });
  });

  describe('sanitize middleware', () => {
    beforeEach(() => {
      app.post('/test', sanitize(defaultSanitizer), (req, res) => {
        res.json({ sanitized: req.body });
      });
    });

    test('should sanitize HTML in strings', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          text: '<script>alert("XSS")</script>Hello',
          nested: {
            html: '<b>Bold</b> text',
          },
          array: ['<i>Item</i>'],
        });

      expect(response.status).toBe(200);
      expect(response.body.sanitized).toEqual({
        text: 'Hello',
        nested: {
          html: 'Bold text',
        },
        array: ['Item'],
      });
    });

    test('should handle primitive values', async () => {
      const response = await request(app)
        .post('/test')
        .send({
          number: 42,
          boolean: true,
          nullValue: null,
        });

      expect(response.status).toBe(200);
      expect(response.body.sanitized).toEqual({
        number: 42,
        boolean: true,
        nullValue: null,
      });
    });
  });

  describe('validateAndSanitize middleware', () => {
    beforeEach(() => {
      app.post('/contact', ...validateAndSanitize(contactFormSchema), (req, res) => {
        res.json({ success: true, data: req.body });
      });
    });

    test('should validate and sanitize contact form data', async () => {
      const response = await request(app)
        .post('/contact')
        .send({
          fullName: '  John Doe  ',
          email: ' JOHN@EXAMPLE.COM ',
          company: '  Acme Inc  ',
          phone: '(123) 456-7890',
          message: '  <script>alert("XSS")</script>Hello World  ',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Inc',
        phone: '+1234567890',
        message: 'Hello World',
      });
    });

    test('should reject invalid contact form data', async () => {
      const response = await request(app)
        .post('/contact')
        .send({
          fullName: 'J', // Too short
          email: 'not-an-email',
          message: 'Hi', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('API schemas', () => {
    test('contactFormSchema validation', () => {
      const validData = {
        fullName: 'John Doe',
        company: 'Acme Inc',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'This is a test message.',
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('subscriptionSchema validation', () => {
      const validData = {
        email: 'john@example.com',
        name: 'John Doe',
        interests: ['AI', 'Automation'],
        marketingConsent: true,
      };

      const result = subscriptionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});