import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/dashboard');
	if (!response.ok) {
		throw new Error('Failed to load dashboard');
	}
	return {
		dashboard: await response.json()
	};
};
