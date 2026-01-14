import { DbOrTx } from '../db.types';
import { User } from '../schema';
import { SignUpInput, UpdateUserInput } from '../validation/userValidation';

export interface UserRepository {
  create(db: DbOrTx, data: SignUpInput): Promise<User>;
  findByEmail(db: DbOrTx, email: string): Promise<User | null>;
  findById(db: DbOrTx, id: string): Promise<User | null>;
  update(db: DbOrTx, userId: string, data: UpdateUserInput): Promise<User | null>;
  addExp(db: DbOrTx, userId: string, exp: number): Promise<User>;
}
