import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { VocabularyService } from '../service/vocabularyService';
import z from 'zod';

const vocabController = new Hono();
const service = new VocabularyService();

vocabController.get('/', authMiddleware, async (c) => {
  const querySchema = z.object({
    level: z.string().optional(),
    category: z.string().optional(),
    partOfSpeech: z.enum(['noun', 'verb', 'adj-i', 'adj-na', 'expression']).optional(),
    search: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    offset: z.coerce.number().min(0).optional()
  });

  const query = querySchema.parse(c.req.query());

  const data = await service.getVocabulary(query);

  return c.json({
    data,
    meta: {
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
      count: data.length
    }
  });
});

export default vocabController;
