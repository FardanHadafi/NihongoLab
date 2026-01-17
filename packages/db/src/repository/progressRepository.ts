import { DbOrTx } from '../db.types';
import { UserProgressDto } from '../validation/userValidation';

export interface ProgressRepository {
  recordAttempt(
    db: DbOrTx,
    data: {
      userId: string;
      questionId: number;
      isCorrect: boolean;
    }
  ): Promise<UserProgressDto>;
}
