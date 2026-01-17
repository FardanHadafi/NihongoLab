import { DbOrTx } from '../db.types';
import { UserProgressDto } from '../validation/userValidation';
import { ProgressRepository } from './progressRepository';
import { userProgress } from '../schema';
import { sql } from 'drizzle-orm';

export class ProgressRepositoryImpl implements ProgressRepository {
  async recordAttempt(
    db: DbOrTx,
    data: {
      userId: string;
      questionId: number;
      isCorrect: boolean;
    }
  ): Promise<UserProgressDto> {
    const [result] = await db
      .insert(userProgress)
      .values({
        userId: data.userId,
        questionId: data.questionId,
        isCorrect: data.isCorrect,
        attempts: 1,
        answeredAt: new Date(),
        lastAttemptedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.questionId],
        set: {
          // increment attempts safely
          attempts: sql`${userProgress.attempts} + 1`,

          // once correct, always correct
          isCorrect: sql`${userProgress.isCorrect} OR ${data.isCorrect}`,

          // timestamps
          answeredAt: new Date(),
          lastAttemptedAt: new Date()
        }
      })
      .returning();

    return result;
  }
}
