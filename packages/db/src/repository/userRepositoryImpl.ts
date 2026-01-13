import { DbOrTx } from '@/db.types';
import { levels, User, users } from '@/schema';
import { SignUpInput, UpdateUserInput } from '@/validation/userValidation';
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

  async addExp(db: DbOrTx, userId: string, exp: number): Promise<User> {
    // Get current user data + current level info
    // Join "users" with "levels" to know the "requiredExp" for the current level
    const result = await db
      .select({
        user: users,
        level: levels
      })
      .from(users)
      .leftJoin(levels, eq(users.levelId, levels.id))
      .where(eq(users.id, userId))
      .limit(1);

    const currentUser = result[0]?.user;
    const currentLevel = result[0]?.level;

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Default fallback if level not found
    const requiredExp = currentLevel?.requiredExp || 100; // Fallback

    // Calculate new state
    let newExp = currentUser.currentExp + exp;
    let newLevelId = currentUser.levelId;
    let leveledUp = false;

    // Level up logic
    // If they have enough exp to level up
    if (newExp >= requiredExp) {
      // Check if next level exist
      const nextLevelId = (currentUser.levelId || 0) + 1;
      const nextLevel = await db.query.levels.findFirst({
        where: eq(levels.id, nextLevelId)
      });

      if (nextLevel) {
        // Level Up ! Reset EXP relative to new level req
        newExp = newExp - requiredExp;
        newLevelId = nextLevelId;
        leveledUp = true;
      } else {
        // Max level Reached
        newExp = requiredExp;
      }
    }

    // Perform the update
    const [updatedUser] = await db
      .update(users)
      .set({
        currentExp: newExp,
        levelId: newLevelId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }
}
