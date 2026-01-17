import {
  db,
  questions,
  userProgress,
  userStats,
  UserRepositoryImpl,
  ProgressRepositoryImpl
} from '@nihongolab/db';
import { eq, and, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export class LearningService {
  private userRepository: UserRepositoryImpl;
  private progressRepository: ProgressRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.progressRepository = new ProgressRepositoryImpl();
  }

  async submitAnswer(userId: string, questionId: number, userAnswer: string) {
    // Validate question
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId)
    });

    if (!question) {
      throw new HTTPException(404, { message: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === userAnswer;

    // Transaction
    return await db.transaction(async (tx) => {
      // Check previous progress (for XP logic)
      const previousProgress = await tx.query.userProgress.findFirst({
        where: and(eq(userProgress.userId, userId), eq(userProgress.questionId, questionId))
      });

      // Record attempt (your existing method)
      const progress = await this.progressRepository.recordAttempt(tx, {
        userId,
        questionId,
        isCorrect
      });

      const isFirstCorrect = isCorrect && (!previousProgress || !previousProgress.isCorrect);

      let expEarned = 0;
      let leveledUp = false;
      let updatedUser = null;

      // XP + level logic (first correct only)
      if (isFirstCorrect) {
        const previousUser = await this.userRepository.findById(tx, userId);

        updatedUser = await this.userRepository.addExp(tx, userId, 1);
        expEarned = 1;

        if (
          previousUser &&
          updatedUser &&
          previousUser.currentLevelId !== updatedUser.currentLevelId
        ) {
          leveledUp = true;
        }
      }

      // Update dashboard stats (inline, no repository)
      await tx
        .insert(userStats)
        .values({
          userId,
          totalAnswered: 1,
          correctAnswers: isCorrect ? 1 : 0,
          streak: 1,
          lastActiveAt: new Date()
        })
        .onConflictDoUpdate({
          target: userStats.userId,
          set: {
            totalAnswered: sql`${userStats.totalAnswered} + 1`,
            correctAnswers: isCorrect
              ? sql`${userStats.correctAnswers} + 1`
              : userStats.correctAnswers,
            lastActiveAt: new Date()
            // streak logic can be improved later
          }
        });

      // Response
      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
        expEarned,
        leveledUp,
        newLevelId: updatedUser?.currentLevelId ?? null,
        userExp: updatedUser?.currentExp ?? null,
        attempts: progress.attempts
      };
    });
  }
}
