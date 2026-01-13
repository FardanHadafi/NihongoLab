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
        name: users.image,
        image: users.image,
        currentExp: users.currentExp,
        levelName: levels.name, // "N5 etc"
        requiredExp: levels.requiredExp
      })
      .from(users)
      .leftJoin(levels, eq(users.levelId, levels.id))
      .where(eq(users.id, userId))
      .limit(1);

    return profile[0] || null;
  }

  // Update non-auth Profile Fields (Name, Image)
  async updateProfile(userId: string, data: UpdateUserInput) {
    return await this.userRepository.update(db, userId, data);
  }
}
