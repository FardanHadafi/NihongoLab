<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';

	export let data;

	// reactive state
	let categories = [...data.categories];
	let nextCursor = data.nextCursor;
	let loading = false;
	let search = data.search ?? '';

	onMount(() => {
		animateIn();
	});

	function animateIn() {
		gsap.from('.word-card', {
			opacity: 0,
			y: 16,
			duration: 0.35,
			stagger: 0.02,
			ease: 'power2.out'
		});
	}

	// debounce without extra utils
	let searchTimeout: any;

	function onSearchInput(value: string) {
		clearTimeout(searchTimeout);

		searchTimeout = setTimeout(() => {
			goto(`?level=${data.levelId}&q=${encodeURIComponent(value)}`, {
				replaceState: true,
				keepFocus: true
			});
		}, 300);
	}

	async function loadMore() {
		if (!nextCursor || loading) return;
		loading = true;

		const params = new URLSearchParams({
			levelId: String(data.levelId),
			limit: '50',
			cursor: String(nextCursor)
		});

		if (search) params.set('q', search);

		const res = await fetch(`/api/vocabulary?${params}`);
		const json = await res.json();

		categories = mergeCategories(categories, json.categories);
		nextCursor = json.nextCursor;
		loading = false;

		requestAnimationFrame(animateIn);
	}

	function mergeCategories(existing: any, incoming: any) {
		const map = new Map<string, any>();

		for (const cat of existing) {
			map.set(cat.category, {
				category: cat.category,
				items: [...cat.items]
			});
		}

		for (const cat of incoming) {
			if (!map.has(cat.category)) {
				map.set(cat.category, cat);
			} else {
				map.get(cat.category).items.push(...cat.items);
			}
		}

		return Array.from(map.values());
	}
</script>

<svelte:head>
	<title>Vocabulary – JLPT</title>
</svelte:head>

<div class="page">
	<!-- HEADER -->
	<header class="top">
		<div>
			<h1>Vocabulary</h1>
			<p class="subtitle">
				JLPT Level {data.levelId === 1 ? 'N5' : 'N4'}
			</p>
		</div>

		<input
			class="search"
			type="text"
			placeholder="Search kanji, reading, meaning…"
			bind:value={search}
			oninput={(e) => onSearchInput(e.target.value)}
		/>
	</header>

	<!-- CONTENT -->
	{#if categories.length === 0}
		<p class="empty">No vocabulary found.</p>
	{:else}
		{#each categories as category}
			<section class="category">
				<h2>{category.category}</h2>

				<div class="grid">
					{#each category.items as item (item.id)}
						<article class="word-card">
							<div class="jp">
								<span class="word">{item.word}</span>
								{#if item.reading}
									<span class="reading">{item.reading}</span>
								{/if}
							</div>

							<div class="meaning">{item.meaning}</div>
							<div class="pos">{item.partOfSpeech}</div>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	{/if}

	<!-- PAGINATION -->
	{#if nextCursor}
		<div class="load-more">
			<button onclick={loadMore} disabled={loading}>
				{loading ? 'Loading…' : 'Load more'}
			</button>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem 1.25rem 4rem;
	}

	/* Header */
	.top {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	h1 {
		font-size: 2.4rem;
		font-weight: 700;
	}

	.subtitle {
		opacity: 0.6;
		margin-top: 0.25rem;
	}

	.search {
		flex: 1;
		max-width: 320px;
		padding: 0.65rem 0.9rem;
		border-radius: 12px;
		border: 1px solid black;
		color: black;
		font-size: 0.95rem;
	}

	.search::placeholder {
		opacity: 0.5;
	}

	/* Categories */
	.category {
		margin-bottom: 3rem;
	}

	.category h2 {
		font-size: 1.4rem;
		text-transform: capitalize;
		margin-bottom: 1rem;
		border-left: 4px solid #666;
		padding-left: 0.75rem;
	}

	/* Grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}

	/* Card */
	.word-card {
		border-radius: 14px;
		padding: 1rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		transition: transform 0.2s ease;
	}

	.word-card:hover {
		transform: translateY(-3px);
	}

	.jp {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.word {
		font-size: 1.4rem;
		font-weight: 600;
	}

	.reading {
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.meaning {
		margin-top: 0.5rem;
		font-size: 0.95rem;
	}

	.pos {
		margin-top: 0.4rem;
		font-size: 0.75rem;
		opacity: 0.5;
		text-transform: uppercase;
	}

	/* Pagination */
	.load-more {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}

	button {
		background: white;
		color: black;
		border: none;
		padding: 0.75rem 1.6rem;
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Empty */
	.empty {
		opacity: 0.6;
		text-align: center;
		margin-top: 3rem;
	}
</style>
