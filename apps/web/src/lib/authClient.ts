import { createAuthClient } from 'better-auth/svelte';

const client = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth'
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient = client as any;

export const { signIn, signUp, signOut, useSession, forgetPassword, resetPassword, verifyEmail } =
	authClient;
