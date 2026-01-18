import { InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';

// USERS

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

  // Learning-related fields
  currentExp: integer('current_exp').default(0).notNull(),
  currentLevelId: integer('current_level_id').references(() => levels.id)
});

// AUTH TABLES (better-auth)

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
  (table) => [index('session_user_id_idx').on(table.userId)]
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
  (table) => [index('account_user_id_idx').on(table.userId)]
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

// LEVELS (JLPT)

export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // N5, N4, ...
  requiredExp: integer('required_exp').notNull()
});

// QUESTIONS

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),

    levelId: integer('level_id')
      .notNull()
      .references(() => levels.id, { onDelete: 'cascade' }),

    questionText: text('question_text').notNull(),
    correctAnswer: text('correct_answer').notNull(),

    options: jsonb('options').$type<string[]>().notNull()
  },
  (table) => [index('questions_level_id_idx').on(table.levelId)]
);

// USER QUESTION PROGRESS

export const userProgress = pgTable(
  'user_progress',
  {
    id: serial('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),

    // Once true, should never become false
    isCorrect: boolean('is_correct').notNull(),

    // Incremented on every attempt
    attempts: integer('attempts').default(1).notNull(),

    // When the question was answered (used for analytics)
    answeredAt: timestamp('answered_at').defaultNow().notNull(),

    // When the user last attempted this question
    lastAttemptedAt: timestamp('last_attempted_at').defaultNow(),

    // ---- Future SRS Support ----
    nextReviewAt: timestamp('next_review_at'),
    easeFactor: integer('ease_factor').default(250)
  },
  (table) => [
    // REQUIRED for UPSERT
    uniqueIndex('user_question_unique_idx').on(table.userId, table.questionId),

    // Performance indexes
    index('user_progress_user_idx').on(table.userId),
    index('user_progress_question_idx').on(table.questionId),
    index('user_progress_last_attempt_idx').on(table.lastAttemptedAt)
  ]
);

// USER DASHBOARD STATS

export const userStats = pgTable('user_stats', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  totalAnswered: integer('total_answered').default(0).notNull(),
  correctAnswers: integer('correct_answers').default(0).notNull(),

  streak: integer('streak').default(0).notNull(),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull()
});

export const usersRelations = relations(users, ({ one }) => ({
  currentLevel: one(levels, {
    fields: [users.currentLevelId],
    references: [levels.id]
  })
}));

// VOCABULARY

export const vocabulary = pgTable(
  'vocabulary',
  {
    id: serial('id').primaryKey(),

    word: text('word').notNull(), // 日本語
    reading: text('reading'), // にほんご
    meaning: text('meaning').notNull(), // "Japanese language"

    levelId: integer('level_id').references(() => levels.id)
  },
  (table) => [index('vocabulary_level_id_idx').on(table.levelId)]
);

// TYPES

export type User = InferSelectModel<typeof users>;
export type Question = InferSelectModel<typeof questions>;
export type UserProgress = InferSelectModel<typeof userProgress>;
export type UserStats = InferSelectModel<typeof userStats>;
export type Vocabulary = InferSelectModel<typeof vocabulary>;
