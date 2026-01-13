import { levels, questions, userProgress, users } from '@/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

// Auth & Users
const userSchema = createInsertSchema(users, {
  name: z.string().min(2, 'Name is required'),
  email: z.email('Invalid email address'),
  image: z.string().optional()
});

export const signUpSchema = userSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters').max(100)
});

export const updateSchema = userSchema
  .pick({
    name: true,
    image: true
  })
  .partial();

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required')
});
export const selectUserSchema = createSelectSchema(users);

// App Content
export const insertLevelSchema = createInsertSchema(levels);
export const selectLevelSchema = createSelectSchema(levels);

export const insertQuestionSchema = createInsertSchema(questions, {
  options: z.array(z.string()).min(2, 'Must have at least 2 options')
});
export const selectQuestionSchema = createSelectSchema(questions, {
  options: z.array(z.string())
});

export const inserUserProgressSchema = createInsertSchema(userProgress);
export const selectUserProgressSchema = createSelectSchema(userProgress);

// Types
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateUserInput = z.infer<typeof updateSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type QuestionDto = z.infer<typeof selectQuestionSchema>;
export type UserProgress = z.infer<typeof selectUserProgressSchema>;
