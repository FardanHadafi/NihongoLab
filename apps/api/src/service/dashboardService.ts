import { db, levels, userProgress, users } from '@nihongolab/db';
import { eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export class DashboardService {
  async getDashboard(userId: string) {
    // User + Level info
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

    // Overall Stats
    const [stats] = await db
      .select({
        totalAnswered: sql<number>`count(*)`,
        correctAnswer: sql<number>`sum(case when is_correct then 1 else 0 end)`
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    // Today Stats
    const [today] = await db
      .select({
        answeredToday: sql<number>`count(*)`,
        correctToday: sql<number>`sum(case when is_correct then 1 else 0 end)`
      })
      .from(userProgress).where(sql`${userProgress.userId} = ${userId}
        AND ${userProgress.lastAttemptedAt} >= current_date`);

    const accuracy =
      stats.totalAnswered > 0 ? Math.round((stats.correctAnswer / stats.totalAnswered) * 100) : 0;

    const progressPercent =
      user.requiredExp > 0 ? Math.round((user.currentExp / user.requiredExp) * 100) : 0;

    return {
      user: {
        id: user.id,
        name: user.name,
        level: user.levelName,
        currentExp: user.currentExp,
        nextLevelExp: user.requiredExp,
        progressPercent
      },
      stats: {
        totalAnswered: stats.totalAnswered ?? 0,
        correctAnswers: stats.correctAnswer ?? 0,
        accuracy
      },
      today: {
        answeredToday: today.answeredToday ?? 0,
        correctToday: today.correctToday ?? 0
      }
    };
  }
}
