import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import { HIRAGANA } from './lib/hiragana';
import { KATAKANA } from './lib/katakana';
import { JishoResponse } from './db.types';

// Setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Helper

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
  while (set.size < size) {
    set.add(pool[Math.floor(Math.random() * pool.length)]);
  }
  return shuffle([...set]);
}

// Kana Seeding (Reading)

async function seedKana(levelId: number) {
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

  await db.insert(schema.questions).values([...hiraganaQuestions, ...katakanaQuestions]);

  console.log(`Seeded ${hiraganaQuestions.length} Hiragana + ${katakanaQuestions.length} Katakana`);
}

// Jisho Fetch

async function fetchFromJisho(jlpt: string) {
  const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=%23${jlpt}`);
  if (!res.ok) return [];
  const json = (await res.json()) as JishoResponse;
  return json.data;
}

// Main Seed

async function main() {
  console.log('Seeding database...');

  const levels = [
    { id: 1, name: 'jlpt-n5', requiredExp: 100 },
    { id: 2, name: 'jlpt-n4', requiredExp: 200 }
  ];

  await db
    .insert(schema.levels)
    .values(levels)
    .onConflictDoUpdate({
      target: schema.levels.id,
      set: { name: sql.raw('excluded.name') }
    });

  // Clear questions
  await db.delete(schema.questions);

  // Seed kana at N5
  await seedKana(1);

  // Kanji Seeding

  for (const level of levels) {
    const words = await fetchFromJisho(level.name);
    if (!words.length) continue;

    const readingPool = words.map((w) => w.japanese[0]?.reading).filter(Boolean) as string[];

    const meaningPool = words
      .map((w) => w.senses[0]?.english_definitions[0])
      .filter(Boolean) as string[];

    const questions: any[] = [];

    for (const w of words) {
      const jp = w.japanese[0];
      const kanji = jp?.word;
      const reading = jp?.reading;
      const meaning = w.senses[0]?.english_definitions[0];

      if (!kanji || !reading || !meaning) continue;

      // Reading Question
      questions.push({
        levelId: level.id,
        scriptType: 'kanji',
        questionType: 'reading',
        questionText: kanji,
        correctAnswer: reading,
        options: buildOptions(reading, readingPool, 5)
      });

      // Meaning Question
      questions.push({
        levelId: level.id,
        scriptType: 'kanji',
        questionType: 'meaning',
        questionText: kanji,
        correctAnswer: meaning,
        options: buildOptions(meaning, meaningPool, 4)
      });
    }

    if (questions.length) {
      await db.insert(schema.questions).values(questions);
      console.log(`Seeded ${questions.length} Kanji questions for ${level.name}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('Seeding complete');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
