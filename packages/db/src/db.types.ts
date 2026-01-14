import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Main DB type
export type Database = NodePgDatabase<typeof schema>;

// The Transaction type (Drizzle derives this from the DB type)
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

// A Union type: The methods will accept "DbOrTx"
export type DbOrTx = Database | Transaction;
