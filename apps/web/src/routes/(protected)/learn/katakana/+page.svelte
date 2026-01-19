<script lang="ts">
	import type { LessonResult, QuizQuestion } from '@nihongolab/db';
	import { onMount } from 'svelte';
	import '../../../../lib/style/learning.css';

	let questions: QuizQuestion[] = [];
	let currentIndex = 0;
	let selected: string | null = null;
	let finished = false;
	let loading = true;

	let lessonResult: LessonResult | null = null;

	// ---------- LESSON FLOW ----------
	async function startLesson() {
		loading = true;
		finished = false;
		currentIndex = 0;
		selected = null;
		lessonResult = null;

		const res = await fetch('/api/learn/katakana?limit=10');
		questions = await res.json();

		loading = false;
	}

	function nextLesson() {
		startLesson();
	}

	onMount(startLesson);

	$: current = questions[currentIndex];

	// ---------- ANSWER ----------
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

	// ---------- COMPLETE ----------
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
