import { LearningService } from '@/service/learningService';
import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth.middleware';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';

const answerInputSchema = z.object({
  questionId: z.number(),
  answer: z.string()
});

const learningController = new Hono();
const learningService = new LearningService();

learningController.use('*', authMiddleware);

// POST /api/learn/submit
learningController.post('/submit', zValidator('json', answerInputSchema), async (c) => {
  const user = c.get('user');
  const { questionId, answer } = c.req.valid('json');

  try {
    const result = await learningService.submitAnswer(user.id, questionId, answer);
    return c.json(result);
  } catch (e) {
    if (e instanceof Error && e.message === 'Question not found') {
      return c.json({ error: e.message }, 404);
    }
    console.error(e);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default learningController;
