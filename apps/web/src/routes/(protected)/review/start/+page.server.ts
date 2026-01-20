import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.session) {
		throw redirect(302, '/login');
	}

	const res = await fetch('/api/dashboard/review/start');

	if (!res.ok) {
		throw new Error('Failed to load review questions');
	}

	const { questions } = await res.json();

	return {
		questions
	};
};
