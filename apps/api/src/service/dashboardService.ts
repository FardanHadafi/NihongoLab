import {
  db,
  levels,
  userProgress,
  users,
  questions,
  userStats,
  DashboardData
} from '@nihongolab/db';
import { eq, sql, and, gte } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

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

  private async getUserStats(userId: string) {
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

  private async getLevelProgress(userId: string) {
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

  private async getRecentActivity(userId: string) {
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

  private async getQuestionsMastered(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.isCorrect, true)));

    return result?.count || 0;
  }

  private async getQuestionsNeedingReview(userId: string): Promise<number> {
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

  private async getNextLevel(currentLevelId: number | null) {
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
