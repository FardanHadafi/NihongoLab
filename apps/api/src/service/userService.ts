import { db, levels, UpdateUserInput, UserRepositoryImpl, users } from '@nihongolab/db';
import { eq } from 'drizzle-orm';

export class UserService {
  private userRepository: UserRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  // Get full user Profile including Level Name (N5 etc)
  // Better-Auth Handles the session so we dont need to write for user SignIn - SignOut
  async getProfile(userId: string) {
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
    return result;
  }

  // Update non-auth Profile Fields (Name, Image)
  async updateProfile(userId: string, data: UpdateUserInput) {
    const updated = await this.userRepository.update(db, userId, data);
    return updated;
  }
}
