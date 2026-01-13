import { createAuthClient } from 'better-auth/svelte';

const client = createAuthClient({
	baseURL: 'http://localhost:3000'
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient = client as any;

export const { signIn, signUp, signOut, useSession, forgetPassword, resetPassword, verifyEmail } =
	authClient;
