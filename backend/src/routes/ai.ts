import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Anthropic from '@anthropic-ai/sdk';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

router.post(
  '/generate-diagram',
  [body('prompt').trim().notEmpty().withMessage('Prompt is required')],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!process.env.ANTHROPIC_API_KEY) {
        res.status(503).json({ error: 'AI generation is not configured on this server.' });
        return;
      }

      const { prompt } = req.body;

      const systemPrompt = `You are an expert system architect. Your task is to design a software architecture diagram based on the user's prompt.
You must return ONLY valid JSON in the exact shape:
{ "nodes": [{"id": "n1", "type": "Microservice", "data": {"label": "Auth Service", "sublabel": "Node.js"}, "position": {"x": 100, "y": 100}}], "edges": [{"id": "e1", "source": "n1", "target": "n2"}] }
Do not return any markdown formatting, backticks, or explanatory text.
Allowed node types ONLY: Client, MobileApp, APIGateway, LoadBalancer, Microservice, Database, Cache, Queue, CDN, Storage.
Organize nodes logically with appropriate x, y coordinates (e.g., Client at top/left, DB at bottom/right). Use spacing of ~200px between nodes.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      });

      const messageContent = response.content[0];
      if (messageContent.type === 'text') {
        let jsonStr = messageContent.text.trim();
        // Fallback cleanup just in case Claude wraps it in markdown
        if (jsonStr.startsWith('```json')) jsonStr = jsonStr.replace(/^```json/, '');
        if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```/, '');
        if (jsonStr.endsWith('```')) jsonStr = jsonStr.replace(/```$/, '');

        const diagramData = JSON.parse(jsonStr);
        res.json(diagramData);
      } else {
        res.status(500).json({ error: 'Unexpected response from AI' });
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate diagram via AI' });
    }
  }
);

export default router;
