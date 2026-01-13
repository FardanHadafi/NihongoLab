import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/schema';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});
const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding Levels');

  const jlptLevels = [
    { id: 1, name: 'N5', requiredExp: 100 },
    { id: 2, name: 'N4', requiredExp: 200 }
  ];

  await db
    .insert(schema.levels)
    .values(jlptLevels)
    .onConflictDoUpdate({
      target: schema.levels.id, // If ID 1 exist
      set: {
        // Update name/exp instead of throwing error
        name: sql`excluded.name`,
        requiredExp: sql`excluded.required_exp`
      }
    });

  console.log('Levels seeded successfully !');
  await pool.end();
}

main().catch((err) => {
  console.error('Seeding Failed:', err);
  process.exit(1);
});
