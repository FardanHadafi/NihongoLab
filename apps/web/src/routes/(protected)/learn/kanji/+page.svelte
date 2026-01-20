<script lang="ts">
	import type { LessonResult, QuizQuestion } from '@nihongolab/db';
	import { onMount } from 'svelte';

	let questions: QuizQuestion[] = [];
	let currentIndex = 0;
	let selected: string | null = null;
	let finished = false;
	let loading = true;

	let lessonResult: LessonResult | null = null;

	// LESSON FLOW
	async function startLesson() {
		loading = true;
		finished = false;
		currentIndex = 0;
		selected = null;
		lessonResult = null;

		const res = await fetch('/api/learn/kanji?limit=10');
		questions = await res.json();

		loading = false;
	}

	function nextLesson() {
		startLesson();
	}

	onMount(startLesson);

	$: current = questions[currentIndex];

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
	<div class="result">
		<h2 class="result-title">Lesson Complete 🎉</h2>

		<p class="result-score">
			{lessonResult.correct} / {lessonResult.total} correct
		</p>

		<p class="result-xp">
			+{lessonResult.expEarned} XP
		</p>

		<div class="result-actions">
			<button class="btn-primary" onclick={nextLesson}> Next </button>

			<a href="/dashboard" class="btn-secondary"> Done </a>
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
		opacity: 0.9;
	}

	/* FEEDBACK */
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

	/* RESULT */
	.result {
		max-width: 420px;
		margin: 2.5rem auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result-title {
		font-size: 2rem;
		font-weight: bold;
	}

	.result-score {
		font-size: 1.1rem;
	}

	.result-xp {
		font-size: 1.3rem;
		font-weight: bold;
		color: #16a34a;
	}

	/* BUTTON */
	.btn-primary {
		display: block;
		width: 100%;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: #2563eb;
		color: white;
		text-decoration: none;
		font-weight: 600;
		transition: background 0.2s ease;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}

	.btn-secondary {
		display: block;
		width: 100%;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: #2563eb;
		color: white;
		text-decoration: none;
		font-weight: 600;
		transition: background 0.2s ease;
	}

	.btn-secondary:hover {
		background: #1d4ed8;
	}
</style>
