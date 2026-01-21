import type { PageServerLoad } from './$types';
import { db, vocabulary, levels } from '@nihongolab/db';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const level = (url.searchParams.get('level') ?? 'N5') as 'N5' | 'N4';
		const partOfSpeech = url.searchParams.get('pos');

		const conditions = [eq(levels.name, `jlpt-${level.toLowerCase()}`)];

		if (partOfSpeech) {
			conditions.push(eq(vocabulary.partOfSpeech, partOfSpeech));
		}

		const rows = await db
			.select({
				word: vocabulary.word,
				reading: vocabulary.reading,
				meaning: vocabulary.meaning,
				category: vocabulary.category,
				partOfSpeech: vocabulary.partOfSpeech
			})
			.from(vocabulary)
			.innerJoin(levels, eq(vocabulary.levelId, levels.id))
			.where(and(...conditions));

		const grouped: Record<string, typeof rows> = {};

		for (const v of rows) {
			const key = v.category ?? 'Other';
			(grouped[key] ??= []).push(v);
		}

		return {
			level,
			partOfSpeech,
			grouped
		};
	} catch (err) {
		console.error('🔥 VOCAB LOAD ERROR:', err);
		throw err; // rethrow so SvelteKit shows 500
	}
};
