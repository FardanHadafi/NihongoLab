import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:5173',
	fetchOptions: {
		credentials: 'include'
	}
});

export const signUp = authClient.signUp;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
