import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

// Jihso API Types
interface JishoResponse {
  data: Array<{
    slug: string; // ex: "taberu"
    japanese: Array<{ word?: string; reading: string }>;
    senses: Array<{ english_definitions: string[] }>;
  }>;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

// Helper : Shuffle an array (Fisher-Yates algorithm)
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [[newArr[i]], [newArr[j]]] = [[newArr[j]], [newArr[i]]];
  }
  return newArr;
}

// Fetcher Function
async function fetchFromJisho(jlptLevel: string) {
  console.log(`Fetching real ${jlptLevel} data from Jisho.org...`);

  // Query Jisho for words woth the specific JLPT tag
  // "jlpt-n5" gets beginner words
  const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=%23${jlptLevel}`);
  const json = (await response.json()) as JishoResponse;
  return json.data;
}

async function main() {
  console.log('Starting Jisho.org Seeding');
  // Seed Levels
  const levelData = [
    { id: 1, name: 'jlpt-n5', requiredExp: 100 },
    { id: 2, name: 'jlpt-n4', requiredExp: 200 }
  ];

  await db
    .insert(schema.levels)
    .values(levelData)
    .onConflictDoUpdate({ target: schema.levels.id, set: { name: sql`excluded.name` } });

  // Clear Old Questions
  await db.delete(schema.questions);

  // Fetch and Seed Questions
  for (const level of levelData) {
    const jishoWords = await fetchFromJisho(level.name);

    // Create a simple array of all possible answer for this level
    const allDefinitions = jishoWords.map((w) => w.senses[0].english_definitions[0]);

    // Build Questions
    const dbQuestions = jishoWords.map((word) => {
      const kanji = word.japanese[0].word || word.japanese[0].reading;
      const reading = word.japanese[0].reading;
      const correctAnswer = word.senses[0].english_definitions[0];

      // The Logic : Pick 4 Random Wrong answers
      // 1. Filter out the correct answer
      const possibleWrongAnswers = allDefinitions.filter((d) => d !== correctAnswer);

      // 2. Shuffle and take the first 4
      const wrongOptions = shuffle(possibleWrongAnswers).slice(0, 4);

      // 3. Combine Correct + Wrong and Shuffle again
      const options = shuffle([correctAnswer, ...wrongOptions]);

      return {
        levelId: level.id,
        questionText: `What is the meaning of "${kanji}" (${reading}) ?`,
        correctAnswer: correctAnswer,
        options: options
      };
    });

    // Save to DB
    if (dbQuestions.length > 0) {
      await db.insert(schema.questions).values(dbQuestions);
      console.log(`Seeded ${dbQuestions.length} questions for ${level.name}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('Database seeding complete !');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
