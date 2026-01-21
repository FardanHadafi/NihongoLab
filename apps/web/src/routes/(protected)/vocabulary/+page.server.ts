import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const levelId = Number(url.searchParams.get('level') ?? 1);
	const search = url.searchParams.get('q') ?? '';

	const res = await fetch(
		`/api/vocabulary?levelId=${levelId}&limit=50&q=${encodeURIComponent(search)}`
	);

	if (!res.ok) {
		throw new Error('Failed to load vocabulary');
	}

	return res.json();
};
