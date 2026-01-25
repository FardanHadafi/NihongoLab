import { betterAuth } from 'better-auth';
import { db } from '@nihongolab/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@nihongolab/db';
import { sendEmail } from './email';
import { openAPI } from 'better-auth/plugins';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
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
