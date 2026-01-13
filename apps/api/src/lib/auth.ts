import { betterAuth } from 'better-auth';
import { db } from '@nihongolab/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@nihongolab/db';
import { sendEmail } from './email';
import { emailOTP } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: process.env.AUTH_BASE_URL!,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link below to verify your email: ${url}`
      });
    },
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified !`);
    }
  },
  trustedOrigins: ['http://localhost:5173']
});

export type Auth = typeof auth;
