import { betterAuth } from 'better-auth';
import { db } from '@nihongolab/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@nihongolab/db';
import { sendEmail } from './email';
import { openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: process.env.AUTH_BASE_URL!,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users, // Map 'user' to your 'users' table
      session: schema.session, // Map 'session' to your 'session' table
      account: schema.account, // Map 'account' to your 'account' table
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${url}&callbackURL=http://localhost:5173/sign-in`;
      console.log('Verification URL:', verificationUrl);
      await sendEmail({
        to: process.env.DEV_MAIL!,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`
      });
    },
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified !`);
    }
  },
  trustedOrigins: ['http://localhost:5173'],
  plugins: [openAPI()]
});

export type Auth = typeof auth;
