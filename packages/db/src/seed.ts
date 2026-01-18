import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

// Jisho API Types
interface JishoResponse {
  data: Array<{
    slug: string;
    japanese: Array<{ word?: string; reading: string }>;
    senses: Array<{ english_definitions: string[] }>;
  }>;
}

// 1. Validation: Ensure DB URL is present before trying to connect
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Ensure you are running with "pnpm db:seed"');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Helper: Standard Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Standard swap syntax (cleaner and faster)
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

async function fetchFromJisho(jlptLevel: string) {
  console.log(`Fetching ${jlptLevel} data from Jisho.org...`);
  try {
    const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=%23${jlptLevel}`);
    if (!response.ok) throw new Error(`Jisho API Error: ${response.statusText}`);

    const json = (await response.json()) as JishoResponse;
    return json.data;
  } catch (error) {
    console.error('Failed to fetch from Jisho:', error);
    return [];
  }
}

async function main() {
  console.log('Starting Database Seed...');

  const levelData = [
    { id: 1, name: 'jlpt-n5', requiredExp: 100 },
    { id: 2, name: 'jlpt-n4', requiredExp: 200 }
  ];

  // Upsert Levels
  await db
    .insert(schema.levels)
    .values(levelData)
    .onConflictDoUpdate({
      target: schema.levels.id,
      set: { name: sql.raw('excluded.name') } // Cleaner Drizzle syntax for excluded
    });

  // Clear Old Questions to avoid duplicates/stale data
  await db.delete(schema.questions);

  for (const level of levelData) {
    const jishoWords = await fetchFromJisho(level.name);

    if (jishoWords.length === 0) {
      console.warn(`No words found for ${level.name}, skipping...`);
      continue;
    }

    // Collect all definitions for distractors
    const allDefinitions = jishoWords
      .map((w) => w.senses[0]?.english_definitions[0])
      .filter(Boolean); // Remove undefined

    const dbQuestions = [];

    for (const word of jishoWords) {
      const kanji = word.japanese[0].word || word.japanese[0].reading;
      const reading = word.japanese[0].reading;
      const correctAnswer = word.senses[0]?.english_definitions[0];

      if (!correctAnswer) continue; // Skip if no definition found

      // Logic: Get 3 Random Wrong answers
      const possibleWrongAnswers = allDefinitions.filter((d) => d !== correctAnswer);

      // Safety: Only create question if we have enough distractors
      if (possibleWrongAnswers.length < 3) continue;

      const wrongOptions = shuffle(possibleWrongAnswers).slice(0, 3); // Take 3 wrong
      const options = shuffle([correctAnswer, ...wrongOptions]); // 3 wrong + 1 correct = 4

      dbQuestions.push({
        levelId: level.id,
        questionText: `What is the meaning of "${kanji}" (${reading})?`,
        correctAnswer: correctAnswer,
        options: options
      });
    }

    if (dbQuestions.length > 0) {
      await db.insert(schema.questions).values(dbQuestions);
      console.log(`Seeded ${dbQuestions.length} questions for ${level.name}`);
    }

    // Gentle delay for API politeness
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('Database seeding complete!');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end(); // Ensure connection closes
  });
