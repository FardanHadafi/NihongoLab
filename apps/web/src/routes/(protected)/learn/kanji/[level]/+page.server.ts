import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const level = params.level as 'N5' | 'N4';

	const res = await fetch(`/api/dashboard/kanji?level=${level}`);

	if (!res.ok) {
		throw new Error('Failed to load kanji questions');
	}

	return {
		level,
		questions: await res.json()
	};
};
