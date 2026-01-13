import { DbOrTx } from '@/db.types';
import { UserProgress } from '@/validation/userValidation';

export interface ProgressRepository {
  recordAttemp(
    db: DbOrTx,
    data: {
      userId: string;
      questionId: number;
      isCorrect: boolean;
    }
  ): Promise<UserProgress>;
}
