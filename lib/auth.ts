import { betterAuth } from 'better-auth';
import { db } from '..';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/schema';
import { sendEmail } from './email';

export const auth = betterAuth({
  baseURL: process.env.AUTH_BASE_URL!,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link below to verify your email: ${url}`
      });
    }
  },
  trustedOrigins: ['http://localhost:5173']
});
