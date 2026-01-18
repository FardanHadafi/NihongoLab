import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Main DB type
export type Database = NodePgDatabase<typeof schema>;

// The Transaction type (Drizzle derives this from the DB type)
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

// A Union type: The methods will accept "DbOrTx"
export type DbOrTx = Database | Transaction;

export interface DashboardData {
  user: {
    name: string;
    currentExp: number;
    currentLevel: {
      name: string;
      requiredExp: number;
    } | null;
    nextLevel: {
      name: string;
      requiredExp: number;
    } | null;
  };
  stats: {
    totalAnswered: number;
    correctAnswers: number;
    accuracyRate: number;
    streak: number;
    lastActiveAt: string;
  };
  levelProgress: Array<{
    levelName: string;
    totalQuestions: number;
    answeredCorrect: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
  questionsMastered: number;
  questionsNeedingReview: number;
}
