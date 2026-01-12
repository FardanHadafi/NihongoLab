import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  // Custom Fields
  currentExp: integer('current_exp').default(0).notNull(),
  levelId: integer('level_id').references(() => levels.id)
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "N5"
  requiredExp: integer('required_exp').notNull() // e.g., 100
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  levelId: integer('level_id')
    .references(() => levels.id, { onDelete: 'cascade' })
    .notNull(),
  questionText: text('question_text').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  options: jsonb('options').$type<string[]>().notNull() // Stores ["A", "B", "C"]
});

// Tracks exactly which questions the user has answered
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: integer('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  isCorrect: boolean('is_correct').notNull(),
  // Great for "Spaced Repetition" algorithms later
  attempts: integer('attempts').default(1).notNull(),
  lastAttemptedAt: timestamp('last_attempted_at', { mode: 'date' }).defaultNow()
});

export type Question = InferSelectModel<typeof questions>;
export type User = InferSelectModel<typeof users>;
