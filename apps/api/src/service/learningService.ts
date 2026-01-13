import { db, ProgressRepositoryImpl, UserRepositoryImpl, questions } from '@nihongolab/db';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export class LearningService {
  private userRepository: UserRepositoryImpl;
  private progressRepository: ProgressRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.progressRepository = new ProgressRepositoryImpl();
  }

  // Handles the entire flow of answering questions:
  // 1. Check validity
  // 2. Starts Transaction
  // 3. Updates Progress
  // 4. Awards XP/Level (If Correct)

  async submitAnswer(userId: string, questionId: number, userAnswer: string) {
    // Validate Question Exist
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
      with: { level: true }
    });

    if (!question) {
      throw new HTTPException(404, {
        message: 'Question not found'
      });
    }

    const isCorrect = question.correctAnswer === userAnswer;

    // Execute Login in Transaction
    return await db.transaction(async (tx) => {
      // Step A: Record the attemp (pass "tx")
      const progress = await this.progressRepository.recordAttemp(tx, {
        userId,
        questionId,
        isCorrect
      });

      let updatedUser = null;
      let leveledUp = false;

      // Step B: Reward Logic (pass "tx")
      if (isCorrect) {
        // Fetch user stace BEFORE UPDATE to check level up
        const previousUser = await this.userRepository.findById(tx, userId);

        // Add 1 XP
        updatedUser = await this.userRepository.addExp(tx, userId, 1);

        // Check if level changed
        if (previousUser && updatedUser && updatedUser.levelId !== previousUser.levelId) {
          leveledUp = true;
        }
      }

      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
        expEarned: isCorrect ? 1 : 0,
        leveledUp,
        newLevelId: updatedUser?.levelId,
        userExp: updatedUser?.currentExp
      };
    });
  }
}
