import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.session) {
		throw redirect(302, '/login');
	}

	const res = await fetch('api/dashboard/review', {
		headers: {
			Authorization: `Bearer ${locals.session.token}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to load review data');
	}

	const { reviewCount } = await res.json();

	return {
		reviewCount
	};
};
