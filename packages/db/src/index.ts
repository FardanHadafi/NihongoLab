import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module-safe way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the root of the monorepo
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000
});
export const db = drizzle(pool, { schema, casing: 'snake_case' });

// Export Schema
export * from './schema';
export * from './validation/userValidation';
// @ts-ignore
export * from './db.types';

// Export Repositories (The Classes)
export * from './repository/userRepositoryImpl';
export * from './repository/progressRepositoryImpl';
// Make sure export the CLASS, not just the interface
