import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000
});
export const db = drizzle(pool, { schema, casing: 'snake_case' });

// Export Schema
export * from './schema';
export * from './validation/userValidation';
export * from './db.types';

// Export Repositories (The Classes)
export * from './repository/userRepositoryImpl';
export * from './repository/progressRepositoryImpl';
// Make sure export the CLASS, not just the interface
