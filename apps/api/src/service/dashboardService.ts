import {
  db,
  levels,
  userProgress,
  users,
  questions,
  userStats,
  DashboardData
} from '@nihongolab/db';
import { eq, sql, and, gte, desc, isNull, lte, or } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export class DashboardService {
  async getDashboard(userId: string): Promise<DashboardData> {
    // User + Current Level info
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        currentExp: users.currentExp,
        levelId: users.currentLevelId,
        levelName: levels.name,
        requiredExp: levels.requiredExp
      })
      .from(users)
      .leftJoin(levels, eq(users.currentLevelId, levels.id))
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found'
      });
    }

    // Get next level
    const nextLevel = await this.getNextLevel(user.levelId);
    // Fetch user statistics
    const statsData = await this.getUserStats(userId);
    // Fetch level progress breakdown
    const levelProgressData = await this.getLevelProgress(userId);
    // Fetch recent activity (last 7 days)
    const recentActivityData = await this.getRecentActivity(userId);
    // Fetch mastered and needs review counts
    const masteredCount = await this.getQuestionsMastered(userId);
    const needsReviewCount = await this.getQuestionsNeedingReview(userId);

    return {
      user: {
        name: user.name,
        currentExp: user.currentExp,
        currentLevel:
          user.levelName && user.requiredExp !== null
            ? {
                name: user.levelName,
                requiredExp: user.requiredExp
              }
            : null,
        nextLevel:
          nextLevel && nextLevel.requiredExp !== null
            ? {
                name: nextLevel.name,
                requiredExp: nextLevel.requiredExp
              }
            : null
      },
      stats: {
        totalAnswered: statsData?.totalAnswered || 0,
        correctAnswers: statsData?.correctAnswers || 0,
        accuracyRate:
          statsData && statsData.totalAnswered > 0
            ? Math.round((statsData.correctAnswers / statsData.totalAnswered) * 100)
            : 0,
        streak: statsData?.streak || 0,
        lastActiveAt: statsData?.lastActiveAt?.toISOString() || new Date().toISOString()
      },
      levelProgress: levelProgressData,
      recentActivity: recentActivityData,
      questionsMastered: masteredCount,
      questionsNeedingReview: needsReviewCount
    };
  }

  async getUserStats(userId: string) {
    // Try to get from userStats table first
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

    if (stats) {
      return stats;
    }

    // Fallback: calculate from userProgress if userStats doesn't exist
    const [calculated] = await db
      .select({
        totalAnswered: sql<number>`count(*)::int`,
        correctAnswers: sql<number>`sum(case when ${userProgress.isCorrect} then 1 else 0 end)::int`
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    return {
      userId,
      totalAnswered: calculated?.totalAnswered || 0,
      correctAnswers: calculated?.correctAnswers || 0,
      streak: 0,
      lastActiveAt: new Date()
    };
  }

  async getLevelProgress(userId: string) {
    // Get all levels
    const allLevels = await db.select().from(levels).orderBy(levels.id);

    const levelProgressData = await Promise.all(
      allLevels.map(async (level) => {
        // Count total questions for this level
        const [totalQuestionsResult] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(questions)
          .where(eq(questions.levelId, level.id));

        const totalQuestions = totalQuestionsResult?.count || 0;

        // Count questions answered correctly by user for this level
        const [answeredCorrectResult] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(userProgress)
          .innerJoin(questions, eq(userProgress.questionId, questions.id))
          .where(
            and(
              eq(userProgress.userId, userId),
              eq(questions.levelId, level.id),
              eq(userProgress.isCorrect, true)
            )
          );

        const answeredCorrect = answeredCorrectResult?.count || 0;

        return {
          levelName: level.name,
          totalQuestions,
          answeredCorrect,
          percentage: totalQuestions > 0 ? Math.round((answeredCorrect / totalQuestions) * 100) : 0
        };
      })
    );

    return levelProgressData;
  }

  async answerReviewQuestion(userId: string, questionId: number, userAnswer: string) {
    const [row] = await db
      .select({
        progressId: userProgress.id,
        correctAnswer: questions.correctAnswer,
        isCorrect: userProgress.isCorrect,
        attempts: userProgress.attempts,
        easeFactor: userProgress.easeFactor
      })
      .from(userProgress)
      .innerJoin(questions, eq(userProgress.questionId, questions.id))
      .where(and(eq(userProgress.userId, userId), eq(userProgress.questionId, questionId)))
      .limit(1);

    if (!row) {
      throw new HTTPException(404, { message: 'Progress not found' });
    }

    // Normalize
    const normalizedUser = userAnswer.trim();
    const normalizedCorrect = row.correctAnswer.trim();
    const isCorrect = normalizedUser === normalizedCorrect;
    const currentEase = row.easeFactor ?? 250;

    let nextEase = currentEase;
    let intervalDays = 1;

    if (isCorrect) {
      nextEase = Math.min(currentEase + 10, 300);
      intervalDays = Math.max(1, Math.round(nextEase / 100));
    } else {
      nextEase = Math.max(currentEase - 20, 130);
      intervalDays = 1;
    }

    const nextReviewAt = addDays(new Date(), intervalDays);

    await db
      .update(userProgress)
      .set({
        isCorrect: row.isCorrect || isCorrect,
        attempts: row.attempts + 1,
        lastAttemptedAt: new Date(),
        nextReviewAt,
        easeFactor: nextEase
      })
      .where(eq(userProgress.id, row.progressId));

    return {
      isCorrect,
      correctAnswer: row.correctAnswer,
      nextReviewAt,
      easeFactor: nextEase
    };
  }

  async getRecentActivity(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get activity grouped by date
    const activityData = await db
      .select({
        date: sql<string>`DATE(${userProgress.answeredAt})`,
        count: sql<number>`count(*)::int`
      })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), gte(userProgress.answeredAt, sevenDaysAgo)))
      .groupBy(sql`DATE(${userProgress.answeredAt})`)
      .orderBy(sql`DATE(${userProgress.answeredAt})`);

    // Fill in missing days with 0 count
    const activityMap = new Map(activityData.map((a) => [a.date, a.count]));
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      result.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0
      });
    }

    return result;
  }

  async getQuestionsMastered(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.isCorrect, true)));

    return result?.count || 0;
  }

  async getQuestionsNeedingReview(userId: string): Promise<number> {
    // Questions with multiple attempts OR questions answered incorrectly
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.attempts} > 1 OR ${userProgress.isCorrect} = false`
        )
      );

    return result?.count || 0;
  }

  async getReviewQuestions(userId: string) {
    return db
      .select({
        progressId: userProgress.id,
        questionId: questions.id,

        // Question data (NO correct answer)
        levelId: questions.levelId,
        scriptType: questions.scriptType,
        questionType: questions.questionType,
        questionText: questions.questionText,
        options: questions.options,

        // Progress data
        attempts: userProgress.attempts,
        isCorrect: userProgress.isCorrect,
        answeredAt: userProgress.answeredAt,
        lastAttemptedAt: userProgress.lastAttemptedAt,
        nextReviewAt: userProgress.nextReviewAt,
        easeFactor: userProgress.easeFactor
      })
      .from(userProgress)
      .innerJoin(questions, eq(userProgress.questionId, questions.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          or(
            // Legacy review logic
            sql`${userProgress.attempts} > 1 OR ${userProgress.isCorrect} = false`,
            // SRS-ready logic
            and(isNull(userProgress.nextReviewAt), eq(userProgress.isCorrect, false)),
            lte(userProgress.nextReviewAt, new Date())
          )
        )
      )
      .orderBy(desc(userProgress.nextReviewAt), desc(userProgress.lastAttemptedAt))
      .limit(20);
  }

  async getKanjiQuestionsByLevel(level: 'N5' | 'N4') {
    return await db
      .select({
        id: questions.id,
        questionText: questions.questionText,
        options: questions.options,
        scriptType: questions.scriptType
      })
      .from(questions)
      .innerJoin(levels, eq(questions.levelId, levels.id))
      .where(eq(levels.name, level));
  }

  async getNextLevel(currentLevelId: number | null) {
    if (!currentLevelId) {
      // If no current level, return the first level (N5)
      const [firstLevel] = await db.select().from(levels).orderBy(levels.id).limit(1);

      return firstLevel || null;
    }

    // Get the next level by ID
    const [nextLevel] = await db
      .select()
      .from(levels)
      .where(sql`${levels.id} > ${currentLevelId}`)
      .orderBy(levels.id)
      .limit(1);

    return nextLevel || null;
  }
}
