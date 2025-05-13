import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { csrfProtection } from '../middleware/csrf';
import { validateAndSanitize } from '../middleware/validation';
import { chatMessageSchema, voiceGenerationSchema, callSummarySchema } from '../schemas/api';

const router = Router();

/**
 * Routes for AI integrations
 */

// POST /api/ai/chat - Process a chat message
router.post('/chat', 
  csrfProtection,
  ...validateAndSanitize(chatMessageSchema),
  aiController.processChat
);

// POST /api/ai/voice - Generate voice audio from text
router.post('/voice', 
  csrfProtection,
  ...validateAndSanitize(voiceGenerationSchema),
  aiController.generateVoice
);

// POST /api/ai/call-summary - Save call summary and send email
router.post('/call-summary',
  csrfProtection,
  ...validateAndSanitize(callSummarySchema),
  aiController.saveCallSummary
);

export default router;