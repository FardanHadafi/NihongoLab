<script lang="ts">
	import { goto } from '$app/navigation';

	const data = $props<{
		level: 'N5' | 'N4';
		partOfSpeech?: string;
		grouped: Record<string, any[]>;
	}>();

	// Server data
	let level = $state(data.level);
	let partOfSpeech = $state(data.partOfSpeech);
	const grouped = data.grouped;

	const categories = Object.keys(grouped);

	function updateFilter(param: string, value: string) {
		const url = new URL(location.href);

		value ? url.searchParams.set(param, value) : url.searchParams.delete(param);

		goto(url.pathname + url.search);
	}
</script>

<svelte:head>
	<title>Vocabulary - {level}</title>
</svelte:head>

<section class="vocab-page">
	<header class="header">
		<h1>📘 Vocabulary - {level}</h1>

		<div class="filters">
			<select bind:value={level} onchange={() => updateFilter('level', level)}>
				<option value="N5">JLPT N5</option>
				<option value="N4">JLPT N4</option>
			</select>

			<select bind:value={partOfSpeech} onchange={() => updateFilter('pos', partOfSpeech ?? '')}>
				<option value="">All Parts of Speech</option>
				<option value="noun">Noun</option>
				<option value="verb">Verb</option>
				<option value="adj-i">i-Adjective</option>
				<option value="adj-na">na-Adjective</option>
				<option value="expression">Expression</option>
			</select>
		</div>
	</header>

	{#if categories.length === 0}
		<p class="empty">No vocabulary found.</p>
	{:else}
		{#each categories as category}
			<section class="category">
				<h2>{category}</h2>

				<ul class="vocab-list">
					{#each grouped[category] as v}
						<li class="vocab-item">
							<div class="jp">
								<span class="word">{v.word ?? '—'}</span>
								<span class="reading">{v.reading}</span>
							</div>

							<div class="meta">
								<span class="meaning">{v.meaning}</span>
								<span class="pos">{v.partOfSpeech}</span>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</section>
