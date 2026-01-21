import { db, vocabulary, levels } from '@nihongolab/db';
import { and, eq, ilike, or } from 'drizzle-orm';

export type GetVocabularyParams = {
  level?: string;
  category?: string;
  partOfSpeech?: 'noun' | 'verb' | 'adj-i' | 'adj-na' | 'expression';
  search?: string;
  limit?: number;
  offset?: number;
};

export class VocabularyService {
  async getVocabulary(params: GetVocabularyParams) {
    const { level, category, partOfSpeech, search, limit = 50, offset = 0 } = params;

    const conditions = [];

    if (level) {
      conditions.push(eq(levels.name, level));
    }

    if (category) {
      conditions.push(eq(vocabulary.category, category));
    }

    if (partOfSpeech) {
      conditions.push(eq(vocabulary.partOfSpeech, partOfSpeech));
    }

    if (search) {
      conditions.push(
        or(
          ilike(vocabulary.word, `%${search}%`),
          ilike(vocabulary.reading, `%${search}%`),
          ilike(vocabulary.meaning, `%${search}%`)
        )
      );
    }

    const data = await db
      .select({
        id: vocabulary.id,
        word: vocabulary.word,
        reading: vocabulary.reading,
        meaning: vocabulary.meaning,
        category: vocabulary.category,
        partOfSpeech: vocabulary.partOfSpeech,
        level: levels.name
      })
      .from(vocabulary)
      .leftJoin(levels, eq(vocabulary.levelId, levels.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(vocabulary.word)
      .limit(Math.min(limit, 100))
      .offset(offset);

    return data;
  }
}
