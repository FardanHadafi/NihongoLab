import { Hono } from 'hono';
import { z } from 'zod';
import { getVocabularyPaginated } from '@/service/vocabularyService';
const querySchema = z.object({
    levelId: z.coerce.number().int().positive(),
    limit: z.coerce.number().int().min(10).max(500).default(25),
    cursor: z.coerce.number().int().optional(),
    search: z.string().min(1).optional()
});
export const vocabularyController = new Hono();
vocabularyController.get('/', async (c) => {
    const parsed = querySchema.safeParse(c.req.query());
    if (!parsed.success) {
        return c.json({ error: 'Invalid query parameters' }, 400);
    }
    const { levelId, limit, cursor, search } = parsed.data;
    const result = await getVocabularyPaginated({
        levelId,
        limit,
        cursor,
        search
    });
    return c.json({
        levelId,
        limit,
        search,
        nextCursor: result.nextCursor,
        categories: result.categories
    });
});
