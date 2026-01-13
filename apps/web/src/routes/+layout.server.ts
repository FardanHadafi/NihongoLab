import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Send user Data & Session to Frontend
	return {
		user: locals.user,
		session: locals.session
	};
};
