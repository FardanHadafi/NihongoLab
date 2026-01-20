<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// ---------- Types ----------
	type QuizQuestion = {
		id: number;
		character: string;
		options: string[];
	};

	type LessonResult = {
		correct: number;
		total: number;
		expEarned: number;
	};

	// ---------- Route param ----------
	const level = $derived(page.params.level);

	// ---------- State ----------
	const questions = $state<QuizQuestion[]>([]);
	let currentIndex = $state(0);
	let selected = $state<string | null>(null);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let loading = $state(true);
	let finished = $state(false);
	let lessonResult = $state<LessonResult | null>(null);

	// ---------- Derived ----------
	const current = $derived(() => questions[currentIndex] ?? null);

	// ---------- Lesson ----------
	async function startLesson() {
		loading = true;
		finished = false;
		currentIndex = 0;
		selected = null;
		feedback = null;
		lessonResult = null;

		const res = await fetch(`/api/learn/kanji?level=${level}&limit=10`);
		const data = await res.json();

		questions.splice(0, questions.length, ...data);
		loading = false;
	}

	onMount(startLesson);

	// ---------- Answer ----------
	async function selectOption(option: string) {
		if (selected || !current()) return;

		selected = option;

		const res = await fetch('/api/learn/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				questionId: current()!.id,
				answer: option
			})
		});

		const result = await res.json();
		feedback = result.correct ? 'correct' : 'wrong';

		setTimeout(() => {
			selected = null;
			feedback = null;
			currentIndex++;

			if (currentIndex >= questions.length) {
				finished = true;
				completeLesson();
			}
		}, 700);
	}

	// ---------- Complete ----------
	async function completeLesson() {
		const res = await fetch('/api/learn/complete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				questionIds: questions.map((q) => q.id)
			})
		});

		lessonResult = await res.json();
	}
</script>

<!-- ================= UI ================= -->

{#if loading}
	<p class="loading">Loading {level} Kanji lesson…</p>

{:else if finished && lessonResult}
	<section class="result">
		<h2>Lesson Complete !</h2>

		<p class="score">
			{lessonResult.correct} / {lessonResult.total} correct
		</p>

		<p class="xp">+{lessonResult.expEarned} XP</p>

		<div class="actions">
			<button onclick={startLesson}>Next</button>
			<a href="/dashboard">Done</a>
		</div>
	</section>

{:else if current()}
	<section class="quiz">
		<p class="progress">
			{level} · Question {currentIndex + 1} / {questions.length}
		</p>

		<div class="kanji">
			{current()!.character}
		</div>

		<div class="options">
			{#each current()!.options as option}
				<button
					class="option"
					class:correct={feedback === 'correct' && option === selected}
					class:wrong={feedback === 'wrong' && option === selected}
					disabled={!!selected}
					onclick={() => selectOption(option)}
				>
					{option}
				</button>
			{/each}
		</div>
	</section>
{/if}

<!-- ================= STYLES ================= -->

<style>
	:global(body) {
		background: #fafafa;
	}

	.loading {
		margin-top: 3rem;
		text-align: center;
		color: #555;
	}

	.quiz {
		max-width: 420px;
		margin: 3rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.progress {
		font-size: 0.85rem;
		color: #777;
		text-align: center;
	}

	.kanji {
		font-size: 5rem;
		font-weight: 700;
		text-align: center;
	}

	.options {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.option {
		padding: 0.75rem;
		font-size: 1.1rem;
		border-radius: 0.5rem;
		border: 2px solid #e5e7eb;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option:hover:not(:disabled) {
		background: #f9fafb;
	}

	.option:disabled {
		cursor: not-allowed;
	}

	.option.correct {
		background: #dcfce7;
		border-color: #22c55e;
		color: #166534;
	}

	.option.wrong {
		background: #fee2e2;
		border-color: #ef4444;
		color: #7f1d1d;
	}

	.result {
		max-width: 420px;
		margin: 3rem auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result h2 {
		font-size: 2rem;
	}

	.score {
		font-size: 1.1rem;
	}

	.xp {
		font-size: 1.4rem;
		font-weight: bold;
		color: #16a34a;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	button,
	a {
		padding: 0.75rem;
		border-radius: 0.5rem;
		font-weight: 600;
		text-decoration: none;
		border: none;
		background: #2563eb;
		color: black;
		cursor: pointer;
	}

	button:hover,
	a:hover {
		background: #1d4ed8;
	}
</style>
