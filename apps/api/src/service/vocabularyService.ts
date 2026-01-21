import { db } from '@nihongolab/db';
import { vocabulary } from '@nihongolab/db';
import { eq, asc, gt, and, or, ilike } from 'drizzle-orm';

type Params = {
  levelId: number;
  limit: number;
  cursor?: number;
  search?: string;
};

export async function getVocabularyPaginated({ levelId, limit, cursor, search }: Params) {
  const whereClause = and(
    eq(vocabulary.levelId, levelId),
    cursor ? gt(vocabulary.id, cursor) : undefined,
    search
      ? or(
          ilike(vocabulary.word, `%${search}%`),
          ilike(vocabulary.reading, `%${search}%`),
          ilike(vocabulary.meaning, `%${search}%`)
        )
      : undefined
  );

  const rows = await db
    .select({
      id: vocabulary.id,
      word: vocabulary.word,
      reading: vocabulary.reading,
      meaning: vocabulary.meaning,
      category: vocabulary.category,
      partOfSpeech: vocabulary.partOfSpeech
    })
    .from(vocabulary)
    .where(whereClause)
    .orderBy(asc(vocabulary.id))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  const page = hasNext ? rows.slice(0, limit) : rows;

  const nextCursor = hasNext ? page[page.length - 1].id : null;

  const grouped = new Map<string, any>();

  for (const r of page) {
    const cat = r.category ?? 'other';
    if (!grouped.has(cat)) grouped.set(cat, { category: cat, items: [] });
    grouped.get(cat).items.push(r);
  }

  return {
    nextCursor,
    categories: Array.from(grouped.values())
  };
}
