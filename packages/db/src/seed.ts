import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

import { HIRAGANA } from './lib/hiragana';
import { KATAKANA } from './lib/katakana';

import N5_KANJI from './lib/N5.json';
import N4_KANJI from './lib/N4.json';

import N5_VOCAB from './lib/N5vocab.json';
import N4_VOCAB from './lib/N4vocab.json';

import { KanjiEntry, PartOfSpeech } from './db.types';

/* -------------------- SETUP -------------------- */

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

/* -------------------- HELPERS -------------------- */

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildOptions(correct: string, pool: string[], size: number) {
  const set = new Set<string>([correct]);
  const poolCopy = pool.filter((p) => p !== correct);

  while (set.size < size && poolCopy.length > 0) {
    const i = Math.floor(Math.random() * poolCopy.length);
    set.add(poolCopy[i]);
  }

  return shuffle([...set]);
}

/* -------------------- KANA SEEDING -------------------- */

async function seedKana(levelId: number) {
  const hiraPool = HIRAGANA.map((h) => h[1]);
  const kataPool = KATAKANA.map((k) => k[1]);

  const hiraganaQuestions = HIRAGANA.map(([char, reading]) => ({
    levelId,
    scriptType: 'hiragana' as const,
    questionType: 'reading' as const,
    questionText: char,
    correctAnswer: reading,
    options: buildOptions(reading, hiraPool, 5)
  }));

  const katakanaQuestions = KATAKANA.map(([char, reading]) => ({
    levelId,
    scriptType: 'katakana' as const,
    questionType: 'reading' as const,
    questionText: char,
    correctAnswer: reading,
    options: buildOptions(reading, kataPool, 5)
  }));

  await db.insert(schema.questions).values(hiraganaQuestions);
  await db.insert(schema.questions).values(katakanaQuestions);
}

/* -------------------- KANJI SEEDING -------------------- */

async function seedKanji(levelId: number, kanjiList: KanjiEntry[]) {
  const readingPool = kanjiList.map((k) => k.reading);
  const meaningPool = kanjiList.map((k) => k.meaning);
  const kanjiPool = kanjiList.map((k) => k.kanji);

  const questions = kanjiList.flatMap((k) => [
    {
      levelId,
      scriptType: 'kanji' as const,
      questionType: 'kanji-to-reading' as const,
      questionText: k.kanji,
      correctAnswer: k.reading,
      options: buildOptions(k.reading, readingPool, 5)
    },
    {
      levelId,
      scriptType: 'kanji' as const,
      questionType: 'kanji-to-meaning' as const,
      questionText: k.kanji,
      correctAnswer: k.meaning,
      options: buildOptions(k.meaning, meaningPool, 4)
    },
    {
      levelId,
      scriptType: 'kanji' as const,
      questionType: 'meaning-to-kanji' as const,
      questionText: k.meaning,
      correctAnswer: k.kanji,
      options: buildOptions(k.kanji, kanjiPool, 4)
    }
  ]);

  const batchSize = 100;
  for (let i = 0; i < questions.length; i += batchSize) {
    await db.insert(schema.questions).values(questions.slice(i, i + batchSize));
  }
}

/* -------------------- VOCABULARY SEEDING -------------------- */

type VocabEntry = {
  word: string;
  reading: string;
  meaning: string;
  category: string;
  partOfSpeech: PartOfSpeech;
};

async function seedVocabulary(levelId: number, vocab: VocabEntry[]) {
  console.log(`Seeding vocabulary (Level ${levelId})`);

  const rows = vocab.map((v) => ({
    levelId,
    word: v.word,
    reading: v.reading,
    meaning: v.meaning,
    category: v.category,
    partOfSpeech: v.partOfSpeech
  }));

  const batchSize = 200;
  for (let i = 0; i < rows.length; i += batchSize) {
    await db.insert(schema.vocabulary).values(rows.slice(i, i + batchSize));
  }

  console.log(`✓ Seeded ${rows.length} vocabulary items`);
}

/* -------------------- MAIN -------------------- */

async function main() {
  console.log('🚀 Starting database seeding...\n');

  const levels = [
    { id: 1, name: 'jlpt-n5', requiredExp: 1000 },
    { id: 2, name: 'jlpt-n4', requiredExp: 2000 }
  ];

  await db
    .insert(schema.levels)
    .values(levels)
    .onConflictDoUpdate({
      target: schema.levels.id,
      set: { name: sql.raw('excluded.name') }
    });

  /* Clear tables */
  await db.delete(schema.questions);
  await db.delete(schema.vocabulary);

  /* Seed content */
  await seedKana(1);
  await seedKanji(1, N5_KANJI);
  await seedKanji(2, N4_KANJI);

  await seedVocabulary(1, N5_VOCAB as VocabEntry[]);
  await seedVocabulary(2, N4_VOCAB as VocabEntry[]);

  console.log('\n✅ Seeding complete!');
}

/* -------------------- RUN -------------------- */

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
