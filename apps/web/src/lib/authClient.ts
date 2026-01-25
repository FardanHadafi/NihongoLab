import { createAuthClient } from 'better-auth/svelte';
import { env } from '$env/dynamic/public';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_AUTH_URL || 'http://localhost:3000',
	fetchOptions: {
		credentials: 'include'
	}
});

export const signUp = authClient.signUp;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
