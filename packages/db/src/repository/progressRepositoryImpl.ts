import { DbOrTx } from '@/db.types';
import { UserProgress } from '@/validation/userValidation';
import { ProgressRepository } from './progressRepository';
import { and, eq } from 'drizzle-orm';
import { userProgress } from '@/schema';

export class ProgressRepositoryImpl implements ProgressRepository {
  async recordAttemp(
    db: DbOrTx,
    data: { userId: string; questionId: number; isCorrect: boolean }
  ): Promise<UserProgress> {
    // Check if progress already exist
    const existing = await db.query.userProgress.findFirst({
      where: and(eq(userProgress.userId, data.userId), eq(userProgress.questionId, data.questionId))
    });

    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({
          isCorrect: data.isCorrect,
          attempts: existing.attempts + 1,
          lastAttemptedAt: new Date()
        })
        .where(eq(userProgress.id, existing.id))
        .returning();

      return updated;
    }

    const [created] = await db
      .insert(userProgress)
      .values({
        userId: data.userId,
        questionId: data.questionId,
        isCorrect: data.isCorrect,
        attempts: 1
      })
      .returning();

    return created;
  }
}
