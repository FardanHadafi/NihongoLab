import { LearningService } from '@/service/learningService';
import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth.middleware';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db, questions } from '@nihongolab/db';
import { and, eq, sql } from 'drizzle-orm';

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

learningController.get('/:script', async (c) => {
  const { script } = c.req.param();
  const limit = Number(c.req.query('limit') ?? 10);

  if (!['hiragana', 'katakana', 'kanji'].includes(script)) {
    return c.json({ error: 'Invalid script type' }, 400);
  }

  // Kana = reading only
  const questionType = script === 'kanji' ? undefined : 'reading';

  const rows = await db
    .select({
      id: questions.id,
      character: questions.questionText,
      options: questions.options
    })
    .from(questions)
    .where(
      questionType
        ? and(eq(questions.scriptType, script), eq(questions.questionType, questionType))
        : eq(questions.scriptType, script)
    )
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return c.json(rows);
});

export default learningController;
