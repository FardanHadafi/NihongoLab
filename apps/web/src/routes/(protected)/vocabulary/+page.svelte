<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	interface VocabularyItem {
		id: number;
		word: string;
		reading: string;
		meaning: string;
		category: string | null;
		partOfSpeech: string;
	}

	interface CategoryGroup {
		category: string;
		items: VocabularyItem[];
	}

	interface PageData {
		categories: CategoryGroup[];
		nextCursor: number | null;
		levelId: number;
		search?: string;
	}

	let { data }: { data: PageData } = $props();

	let searchQuery = $state(page.url.searchParams.get('q') ?? '');
	let selectedLevel = $state(Number(page.url.searchParams.get('level') ?? 1));
	let searchTimeout: ReturnType<typeof setTimeout>;

	// State for infinite scroll
	let allCategories = $state<CategoryGroup[]>(data.categories || []);
	let nextCursor = $state<number | null>(data.nextCursor ?? null);
	let isLoading = $state(false);

	// Merge categories helper
	function mergeCategories(existing: CategoryGroup[], newData: CategoryGroup[]): CategoryGroup[] {
		const merged = new Map<string, VocabularyItem[]>();

		// Add existing items
		existing.forEach((cat) => {
			merged.set(cat.category, [...cat.items]);
		});

		// Merge new items
		newData.forEach((cat) => {
			const existingItems = merged.get(cat.category) || [];
			merged.set(cat.category, [...existingItems, ...cat.items]);
		});

		return Array.from(merged.entries()).map(([category, items]) => ({
			category,
			items
		}));
	}

	// Calculate total vocabulary count
	let totalCount = $derived.by(() => {
		if (!allCategories) return 0;
		return allCategories.reduce((sum, cat) => sum + cat.items.length, 0);
	});

	async function loadMore() {
		if (nextCursor === null || isLoading) return;

		isLoading = true;

		try {
			const params = new URLSearchParams({
				levelId: selectedLevel.toString(),
				limit: '25',
				cursor: nextCursor.toString()
			});

			if (searchQuery) {
				params.set('q', searchQuery);
			}

			const res = await fetch(`/api/vocabulary?${params.toString()}`);

			if (!res.ok) {
				throw new Error('Failed to load more vocabulary');
			}

			const newData = await res.json();

			console.log('Loaded more data:', {
				prevCursor: nextCursor,
				newCursor: newData.nextCursor,
				newItems:
					newData.categories?.reduce(
						(sum: number, cat: CategoryGroup) => sum + cat.items.length,
						0
					) ?? 0
			});

			allCategories = mergeCategories(allCategories, newData.categories || []);
			nextCursor = newData.nextCursor;
		} catch (error) {
			console.error('Error loading more vocabulary:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleSearch(value: string) {
		searchQuery = value;

		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			updateURL();
		}, 300);
	}

	function handleLevelChange(level: number) {
		selectedLevel = level;
		updateURL();
	}

	function updateURL() {
		const params = new URLSearchParams();
		if (selectedLevel !== 1) params.set('level', selectedLevel.toString());
		if (searchQuery) params.set('q', searchQuery);

		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function clearSearch() {
		searchQuery = '';
		updateURL();
	}

	function getCategoryDisplayName(category: string): string {
		return category.charAt(0).toUpperCase() + category.slice(1);
	}
</script>

<div class="container">
	<header class="header">
		<h1>Japanese Vocabulary</h1>
		<p class="subtitle">Learn and explore Japanese words by category</p>
	</header>

	<div class="controls">
		<div class="search-bar">
			<input
				type="text"
				placeholder="Search vocabulary..."
				value={searchQuery}
				oninput={(e) => handleSearch(e.currentTarget.value)}
				class="search-input"
			/>
			{#if searchQuery}
				<button onclick={clearSearch} class="clear-btn" aria-label="Clear search"> ✕ </button>
			{/if}
		</div>

		<div class="level-selector">
			<label for="level">Level:</label>
			<select
				id="level"
				value={selectedLevel}
				onchange={(e) => handleLevelChange(Number(e.currentTarget.value))}
			>
				{#each Array(5) as _, i}
					<option value={i + 1}>N{5 - i}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="stats">
		<span class="stat-badge">{totalCount} words loaded</span>
		<span class="stat-badge">{allCategories?.length || 0} categories</span>
		{#if nextCursor}
			<span class="stat-badge more-available">More available ↓</span>
		{/if}
	</div>

	{#if !allCategories || allCategories.length === 0}
		<div class="empty-state">
			<p>No vocabulary found</p>
			<p class="empty-hint">Try adjusting your search or level filter</p>
		</div>
	{:else}
		<div class="categories">
			{#each allCategories as categoryGroup}
				<section class="category-section">
					<h2 class="category-title">
						{getCategoryDisplayName(categoryGroup.category)}
						<span class="category-count">{categoryGroup.items.length}</span>
					</h2>

					<div class="vocab-grid">
						{#each categoryGroup.items as vocab}
							<div class="vocab-card">
								<div class="vocab-japanese">{vocab.word}</div>
								{#if vocab.reading}
									<div class="vocab-reading">{vocab.reading}</div>
								{/if}
								<div class="vocab-english">{vocab.meaning}</div>
								<div class="vocab-pos">{vocab.partOfSpeech}</div>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>

		{#if nextCursor}
			<div class="load-more-container">
				<button class="load-more-btn" onclick={loadMore} disabled={isLoading || nextCursor === null}
					>Load More
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2.5rem;
		color: #2c3e50;
		margin: 0 0 0.5rem 0;
		font-weight: 700;
	}

	.subtitle {
		color: #7f8c8d;
		font-size: 1.1rem;
		margin: 0;
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.search-bar {
		flex: 1;
		min-width: 250px;
		position: relative;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.search-input:focus {
		outline: none;
		border-color: #3498db;
		box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
	}

	.clear-btn {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.clear-btn:hover {
		background: #c0392b;
	}

	.level-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.level-selector label {
		font-weight: 600;
		color: #2c3e50;
	}

	.level-selector select {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		transition: border-color 0.3s;
	}

	.level-selector select:focus {
		outline: none;
		border-color: #3498db;
	}

	.stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.stat-badge {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.stat-badge.more-available {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #7f8c8d;
	}

	.empty-state p {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	.empty-hint {
		font-size: 1rem;
		color: #95a5a6;
	}

	.categories {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.category-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.category-title {
		font-size: 1.5rem;
		color: #2c3e50;
		margin: 0 0 1.5rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 3px solid #3498db;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.category-count {
		background: #3498db;
		color: white;
		font-size: 0.9rem;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-weight: 600;
	}

	.vocab-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.vocab-card {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-radius: 10px;
		padding: 1.25rem;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.vocab-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
		border-color: #3498db;
	}

	.vocab-japanese {
		font-size: 1.8rem;
		font-weight: 700;
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.vocab-reading {
		font-size: 1rem;
		color: #e74c3c;
		margin-bottom: 0.5rem;
	}

	.vocab-english {
		font-size: 1rem;
		color: #27ae60;
		font-weight: 600;
		padding-top: 0.5rem;
		border-top: 1px solid #dee2e6;
		margin-bottom: 0.5rem;
	}

	.vocab-pos {
		font-size: 0.85rem;
		color: #7f8c8d;
		font-style: italic;
		background: #e9ecef;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		display: inline-block;
	}

	.load-more-container {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
		padding-bottom: 2rem;
	}

	.load-more-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 1rem 2.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.load-more-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
	}

	.load-more-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.controls {
			flex-direction: column;
		}

		.search-bar {
			width: 100%;
		}

		.vocab-grid {
			grid-template-columns: 1fr;
		}

		.load-more-btn {
			padding: 0.875rem 2rem;
			font-size: 1rem;
		}
	}
</style>
