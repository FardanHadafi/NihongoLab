import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  // Custom Fields for my App:
  currentExp: integer('current_exp').default(0),
  levelId: integer('level_id').references(() => levels.id) // Links to Levels table
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(), // Important for Better-Auth
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password') // Hashed password lives here
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});

export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "N5"
  requiredExp: integer('required_exp').notNull() // e.g., 100
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  levelId: integer('level_id')
    .references(() => levels.id)
    .notNull(),
  questionText: text('question_text').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  options: jsonb('options') // Stores ["A", "B", "C"]
});
