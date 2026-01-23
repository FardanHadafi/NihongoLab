<script lang="ts">
	import type { LessonResult, QuizQuestion } from '@nihongolab/db';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let questions: QuizQuestion[] = $state([]);
	let currentIndex = $state(0);
	let selected: string | null = $state(null);
	let finished = $state(false);
	let loading = $state(true);

	let lessonResult: LessonResult | null = $state(null);

	// LESSON FLOW
	async function startLesson() {
		loading = true;
		finished = false;
		currentIndex = 0;
		selected = null;
		lessonResult = null;

		const res = await fetch('/api/learn/hiragana?limit=10');
		questions = await res.json();

		loading = false;
	}

	function nextLesson() {
		startLesson();
	}

	onMount(startLesson);

	let current = $derived(questions[currentIndex]);

	// ANSWER
	async function selectOption(option: string) {
		if (selected || !current) return;

		selected = option;

		// Authoritative submit
		await fetch('/api/learn/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				questionId: current.id,
				answer: option
			})
		});

		// Feedback delay
		setTimeout(() => {
			selected = null;
			currentIndex++;

			if (currentIndex >= questions.length) {
				finished = true;
				completeLesson();
			}
		}, 700);
	}

	// COMPLETE
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

<!-- LOADING -->
{#if loading}
	<p class="loading">Loading lesson...</p>

	<!-- RESULT -->
{:else if finished && lessonResult}
	<div class="result-card">
		<div class="result-header">
			<h2 class="result-title">Lesson Complete !</h2>
		</div>

		<div class="stats-grid">
			<div class="stat-item">
				<span class="stat-label">Accuracy</span>
				<span class="stat-value">{lessonResult.correct} / {lessonResult.total}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">Experience</span>
				<span class="stat-value xp">+{lessonResult.expEarned} XP</span>
			</div>
		</div>

		<div class="result-actions">
			<button class="btn-primary" onclick={nextLesson}> Next </button>
			<button onclick={() => goto("/dashboard")} class="btn-secondary"> Done </button>
		</div>
	</div>

	<!-- QUIZ -->
{:else if current}
	<div class="quiz">
		<p class="quiz-progress">
			Question {currentIndex + 1} / {questions.length}
		</p>

		<div class="quiz-character">
			{current.character}
		</div>

		<div class="options-grid">
			{#each current.options as option}
				<button
					class="option"
					class:correct={selected && option === current.correct}
					class:wrong={selected && option === selected && option !== current.correct}
					disabled={!!selected}
					onclick={() => selectOption(option)}
				>
					{option}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* GENERAL */
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.loading {
		margin-top: 2.5rem;
		text-align: center;
		font-size: 1rem;
		color: #444;
	}

	/* QUIZ */
	.quiz {
		max-width: 420px;
		margin: 2.5rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.quiz-progress {
		font-size: 0.85rem;
		color: #777;
	}

	.quiz-character {
		text-align: center;
		font-size: 4.5rem;
		font-weight: bold;
	}

	/* OPTIONS */
	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.option {
		padding: 0.75rem;
		font-size: 1.1rem;
		border-radius: 0.5rem;
		border: 2px solid #ddd;
		background: #fff;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option:hover:not(:disabled) {
		background: #f5f5f5;
	}

	.option:disabled {
		cursor: not-allowed;
	}

	/* FEEDBACK */
	.option.correct {
		background: #dcfce7 !important;
		border-color: #22c55e !important;
		color: #166534 !important;
		opacity: 1 !important;
	}

	.option.wrong {
		background: #fee2e2 !important;
		border-color: #ef4444 !important;
		color: #7f1d1d !important;
		opacity: 1 !important;
	}

	/* RESULT */
	.result-card {
		max-width: 420px;
		margin: 2.5rem auto;
		padding: 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		text-align: center;
	}

	.result-header {
		margin-bottom: 2rem;
	}

	.result-title {
		font-size: 1.5rem;
		font-weight: bold;
		color: #1f2937;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: bold;
		color: #111827;
	}

	.stat-value.xp {
		color: #16a34a;
	}

	.result-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* BUTTON */
	.btn-primary,
	.btn-secondary {
		display: block;
		width: 100%;
		padding: 0.75rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
		cursor: pointer;
		border: none;
		text-align: center;
	}

	.btn-primary {
		background: #2563eb;
		color: white;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}

	.btn-secondary {
		background: #2563eb;
		color: white;
	}

	.btn-secondary:hover {
		background: #1d4ed8;
	}
</style>
