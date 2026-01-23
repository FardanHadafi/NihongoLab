import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const levelId = Number(url.searchParams.get('level') ?? 1);
	const search = url.searchParams.get('q') ?? '';

	const params = new URLSearchParams({
		levelId: levelId.toString(),
		limit: '25'
	});

	if (search) {
		params.set('search', search);
	}

	const res = await fetch(`/api/vocabulary?${params.toString()}`);

	if (!res.ok) {
		throw new Error('Failed to load vocabulary');
	}

	const data = await res.json();
	return data;
};
