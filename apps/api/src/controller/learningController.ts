import { LearningService } from '@/service/learningService';
import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth.middleware';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db, levels, questions } from '@nihongolab/db';
import { eq, sql } from 'drizzle-orm';

const answerInputSchema = z.object({
  questionId: z.number(),
  answer: z.string()
});
const lessonCompleteSchema = z.object({
  questionIds: z.array(z.number())
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

// POST /api/learn/complete
learningController.post(
  '/complete',
  zValidator(
    'json',
    z.object({
      questionIds: z.array(z.number()).min(5)
    })
  ),
  async (c) => {
    const user = c.get('user');
    const { questionIds } = c.req.valid('json');

    try {
      const result = await learningService.completeLesson(user.id, questionIds);
      return c.json(result);
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Failed to complete lesson' }, 500);
    }
  }
);

learningController.get('/:type/quiz', async (c) => {
  const { type } = c.req.param();
  const limit = Number(c.req.query('limit') ?? 10);

  if (!['hiragana', 'katakana', 'kanji'].includes(type)) {
    return c.json({ error: 'Invalid lesson type' }, 400);
  }

  const quiz = await db
    .select({
      id: questions.id,
      character: questions.questionText,
      options: questions.options,
      correct: questions.correctAnswer
    })
    .from(questions)
    .innerJoin(levels, eq(questions.levelId, levels.id))
    .where(eq(levels.name, type))
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return c.json(quiz);
});

export default learningController;
