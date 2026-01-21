<script lang="ts">
	import type { LessonResult, QuizQuestion } from '@nihongolab/db';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let questions: QuizQuestion[] = [];
	let currentIndex = 0;
	let selected: string | null = null;
	let finished = false;
	let loading = true;

	let lessonResult: LessonResult | null = null;

	$: level = $page.params.level;
	$: current = questions[currentIndex];

	// LESSON FLOW
	async function startLesson() {
		loading = true;
		finished = false;
		currentIndex = 0;
		selected = null;
		lessonResult = null;

		const res = await fetch(`/api/learn/kanji?level=${level}&limit=10`);
		questions = await res.json();

		loading = false;
	}

	onMount(startLesson);

	// ANSWER
	async function selectOption(option: string) {
		if (selected || !current) return;

		selected = option;

		await fetch('/api/learn/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				questionId: current.id,
				answer: option
			})
		});

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

	// Heuristic: if options contain kanji → meaning question
	function questionSentence(q: QuizQuestion) {
		const kanjiRegex = /[\u4e00-\u9faf]/;
		const optionsHaveKanji = q.options.some((o) => kanjiRegex.test(o));

		if (optionsHaveKanji) return 'Which kanji matches this meaning?';
		if (kanjiRegex.test(q.character)) return 'What does this kanji mean?';
		return 'How do you read this kanji?';
	}
</script>

<!-- LOADING -->
{#if loading}
	<p class="loading">Loading Kanji lesson...</p>

	<!-- RESULT -->
{:else if finished && lessonResult}
	<div class="result">
		<h2 class="result-title">Lesson Complete 🎉</h2>

		<p>{lessonResult.correct} / {lessonResult.total} correct</p>
		<p class="result-xp">+{lessonResult.expEarned} XP</p>

		<button class="btn-primary" onclick={startLesson}>Next Lesson</button>
		<a href="/dashboard" class="btn-secondary">Done</a>
	</div>

	<!-- QUIZ -->
{:else if current}
	<div class="quiz">
		<p class="quiz-progress">
			{level.toUpperCase()} · Question {currentIndex + 1} / {questions.length}
		</p>

		<p class="quiz-type">{questionSentence(current)}</p>

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
		text-align: center;
	}

	.quiz-type {
		text-align: center;
		font-weight: 600;
		color: #2563eb;
	}

	.quiz-character {
		text-align: center;
		font-size: 4.5rem;
		font-weight: bold;
	}

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
	}

	.option.correct {
		background: #dcfce7;
		border-color: #22c55e;
	}

	.option.wrong {
		background: #fee2e2;
		border-color: #ef4444;
	}

	.result {
		text-align: center;
		margin-top: 2rem;
	}

	.result-xp {
		font-weight: bold;
		color: #16a34a;
	}

	.btn-primary,
	.btn-secondary {
		display: block;
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		text-align: center;
		font-weight: 600;
	}

	.btn-primary {
		background: #2563eb;
		color: white;
	}

	.btn-secondary {
		background: #6b7280;
		color: white;
	}
</style>
