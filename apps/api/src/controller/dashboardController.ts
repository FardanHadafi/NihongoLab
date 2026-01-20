import { Hono } from 'hono';
import { DashboardService } from '../service/dashboardService';
import { authMiddleware } from '../middleware/auth.middleware';
import z from 'zod';

const dashboardController = new Hono();
const service = new DashboardService();

dashboardController.get('/', authMiddleware, async (c) => {
  const user = c.get('user'); // from better-auth middleware

  const data = await service.getDashboard(user.id);

  return c.json(data);
});

dashboardController.get('/review', authMiddleware, async (c) => {
  const user = c.get('user'); // from better-auth middleware

  const reviewCount = await service.getQuestionsNeedingReview(user.id);

  return c.json({
    reviewCount
  });
});

dashboardController.get('/review/start', authMiddleware, async (c) => {
  const user = c.get('user') as { id: string };

  const questions = await service.getReviewQuestions(user.id);

  return c.json({ questions });
});

dashboardController.post('/review/answer', authMiddleware, async (c) => {
  const user = c.get('user') as { id: string };

  const bodySchema = z.object({
    questionId: z.number(),
    userAnswer: z.string().min(1)
  });

  const body = bodySchema.parse(await c.req.json());

  const result = await service.answerReviewQuestion(user.id, body.questionId, body.userAnswer);

  return c.json(result);
});

dashboardController.get('/kanji', authMiddleware, async (c) => {
  const level = c.req.query('level') as 'N5' | 'N4';

  const data = await service.getKanjiQuestionsByLevel(level);
  return c.json(data);
});

export default dashboardController;
