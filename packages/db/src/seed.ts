import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import { HIRAGANA } from './lib/hiragana';
import { KATAKANA } from './lib/katakana';
import N5_KANJI from './lib/N5.json';
import N4_KANJI from './lib/N4.json';
import { KanjiEntry } from './db.types';

// Setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Helpers
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
    const randomIndex = Math.floor(Math.random() * poolCopy.length);
    set.add(poolCopy[randomIndex]);
  }

  return shuffle([...set]);
}

// Kana Seeding
async function seedKana(levelId: number) {
  console.log(`\nSeeding Kana for Level ${levelId}`);

  const hiraganaReadings = HIRAGANA.map((h) => h[1]);
  const katakanaReadings = KATAKANA.map((k) => k[1]);

  const hiraganaQuestions = HIRAGANA.map(([char, reading]) => ({
    levelId,
    scriptType: 'hiragana' as const,
    questionType: 'reading' as const,
    questionText: char,
    correctAnswer: reading,
    options: buildOptions(reading, hiraganaReadings, 5)
  }));

  const katakanaQuestions = KATAKANA.map(([char, reading]) => ({
    levelId,
    scriptType: 'katakana' as const,
    questionType: 'reading' as const,
    questionText: char,
    correctAnswer: reading,
    options: buildOptions(reading, katakanaReadings, 5)
  }));

  await db.insert(schema.questions).values(hiraganaQuestions);
  await db.insert(schema.questions).values(katakanaQuestions);

  console.log(
    `✓ Seeded ${hiraganaQuestions.length} Hiragana + ${katakanaQuestions.length} Katakana`
  );
}

// Kanji Seeding
async function seedKanji(levelId: number, kanjiList: KanjiEntry[]) {
  console.log(`\nSeeding Kanji for Level ${levelId}`);

  const readingPool = kanjiList.map((k) => k.reading);
  const meaningPool = kanjiList.map((k) => k.meaning);

  const questions = kanjiList.flatMap((k) => [
    {
      levelId,
      scriptType: 'kanji' as const,
      questionType: 'reading' as const,
      questionText: k.kanji,
      correctAnswer: k.reading,
      options: buildOptions(k.reading, readingPool, 5)
    },
    {
      levelId,
      scriptType: 'kanji' as const,
      questionType: 'meaning' as const,
      questionText: k.kanji,
      correctAnswer: k.meaning,
      options: buildOptions(k.meaning, meaningPool, 4)
    }
  ]);

  const batchSize = 100;
  for (let i = 0; i < questions.length; i += batchSize) {
    await db.insert(schema.questions).values(questions.slice(i, i + batchSize));
  }

  console.log(`✓ Seeded ${questions.length} Kanji questions`);
}

// Main
async function main() {
  console.log('Starting database seeding...\n');

  const levels = [
    { id: 1, name: 'jlpt-n5', requiredExp: 1000 },
    { id: 2, name: 'jlpt-n4', requiredExp: 2000 }
  ];

  console.log('Upserting levels...');
  await db
    .insert(schema.levels)
    .values(levels)
    .onConflictDoUpdate({
      target: schema.levels.id,
      set: { name: sql.raw('excluded.name') }
    });
  console.log('✓ Levels upserted\n');

  console.log('Clearing existing questions...');
  await db.delete(schema.questions);
  console.log('✓ Questions cleared\n');

  // Kana (N5 only)
  await seedKana(1);

  // Kanji (JSON-based)
  await seedKanji(1, N5_KANJI);
  await seedKanji(2, N4_KANJI);

  // Summary
  console.log('\nSummary');
  const counts = await db
    .select({
      scriptType: schema.questions.scriptType,
      questionType: schema.questions.questionType,
      count: sql<number>`count(*)`
    })
    .from(schema.questions)
    .groupBy(schema.questions.scriptType, schema.questions.questionType);

  console.table(counts);
  console.log('\nSeeding complete!');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
