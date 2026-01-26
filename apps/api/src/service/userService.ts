import { db, levels, UpdateUserInput, UserRepositoryImpl, users } from '@nihongolab/db';
import { eq } from 'drizzle-orm';
import { cache } from '@repo/redis';

export class UserService {
  private userRepository: UserRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  // Get full user Profile including Level Name (N5 etc)
  // Better-Auth Handles the session so we dont need to write for user SignIn - SignOut
  async getProfile(userId: string) {
    const cacheKey = `user:profile:${userId}`;
    const cached = await cache.get<any>(cacheKey);
    if (cached) return cached;

    const profile = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        currentExp: users.currentExp,
        levelName: levels.name, // "N5 etc"
        requiredExp: levels.requiredExp
      })
      .from(users)
      .leftJoin(levels, eq(users.currentLevelId, levels.id))
      .where(eq(users.id, userId))
      .limit(1);

    const result = profile[0] || null;
    if (result) {
      await cache.set(cacheKey, result, 600); // Cache for 10 minutes
    }
    return result;
  }

  // Update non-auth Profile Fields (Name, Image)
  async updateProfile(userId: string, data: UpdateUserInput) {
    const updated = await this.userRepository.update(db, userId, data);
    if (updated) {
      await cache.delete(`user:profile:${userId}`);
    }
    return updated;
  }
}
