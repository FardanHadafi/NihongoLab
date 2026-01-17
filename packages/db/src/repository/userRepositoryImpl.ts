import { DbOrTx } from '../db.types';
import { levels, User, users } from '../schema';
import { SignUpInput, UpdateUserInput } from '../validation/userValidation';
import { UserRepository } from './userRepository';
import { eq } from 'drizzle-orm';

export class UserRepositoryImpl implements UserRepository {
  async create(db: DbOrTx, data: SignUpInput): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        image: data.image,
        emailVerified: false
      })
      .returning();

    return newUser;
  }

  async findById(db: DbOrTx, id: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });

    return result ?? null;
  }

  async findByEmail(db: DbOrTx, email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    return result ?? null;
  }

  async update(db: DbOrTx, userId: string, data: UpdateUserInput): Promise<User | null> {
    if (Object.keys(data).length === 0) {
      return this.findById(db, userId);
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser ?? null;
  }

  async addExp(db: DbOrTx, userId: string, expGained: number): Promise<User> {
    // Fetch user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Fetch all levels ordered by difficulty
    const allLevels = await db.query.levels.findMany({
      orderBy: (levels, { asc }) => [asc(levels.requiredExp)]
    });

    if (!allLevels.length) {
      throw new Error('No levels configured');
    }

    let currentExp = currentUser.currentExp + expGained;
    let currentLevelIndex = allLevels.findIndex((l) => l.id === currentUser.currentLevelId);

    // If user has no level yet, assign first level
    if (currentLevelIndex === -1) {
      currentLevelIndex = 0;
    }

    // Level-up loop (supports multi-level ups)
    while (
      currentLevelIndex < allLevels.length - 1 &&
      currentExp >= allLevels[currentLevelIndex].requiredExp
    ) {
      currentExp -= allLevels[currentLevelIndex].requiredExp;
      currentLevelIndex++;
    }

    // Clamp EXP at max level
    if (currentLevelIndex === allLevels.length - 1) {
      currentExp = Math.min(currentExp, allLevels[currentLevelIndex].requiredExp);
    }

    const newLevelId = allLevels[currentLevelIndex].id;

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        currentExp,
        currentLevelId: newLevelId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }
}
