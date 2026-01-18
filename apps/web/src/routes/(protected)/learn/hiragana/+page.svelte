<script lang="ts">
	import type { LessonResult, QuizQuestion } from '@nihongolab/db';
	import { onMount } from 'svelte';
	import '../../../../lib/style/hiragana.css';

	let questions: QuizQuestion[] = [];
	let currentIndex = 0;
	let selected: string | null = null;
	let finished = false;
	let loading = true;

	let lessonResult: LessonResult | null = null;

	onMount(async () => {
		const res = await fetch('/api/learn/hiragana/quiz?limit=10');
		questions = await res.json();
		loading = false;
	});

	$: current = questions[currentIndex];

	async function selectOption(option: string) {
		if (selected || !current) return;

		selected = option;

		// submit answer (authoritative)
		await fetch('/api/learn/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				questionId: current.id,
				answer: option
			})
		});

		// delay = feedback time
		setTimeout(() => {
			selected = null;
			currentIndex++;

			if (currentIndex >= questions.length) {
				finished = true;
				completeLesson();
			}
		}, 700);
	}

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
	<p class="text-center mt-10">Loading lesson...</p>

	<!-- RESULT -->
{:else if finished && lessonResult}
	<div class="max-w-md mx-auto mt-10 text-center space-y-4">
		<h2 class="text-3xl font-bold">Lesson Complete 🎉</h2>

		<p class="text-lg">
			{lessonResult.correct} / {lessonResult.total} correct
		</p>

		<p class="text-green-600 font-semibold text-xl">
			+{lessonResult.expEarned} XP
		</p>

		<a href="/learn" class="btn btn-primary w-full"> Continue </a>
	</div>

	<!-- QUIZ -->
{:else if current}
	<div class="max-w-md mx-auto mt-10 space-y-6">
		<p class="text-sm text-gray-500">
			Question {currentIndex + 1} / {questions.length}
		</p>

		<div class="text-center text-7xl font-bold">
			{current.character}
		</div>

		<div class="grid grid-cols-2 gap-4">
			{#each current.options as option}
				<button
					class="option"
					class:correct={selected && option === current.correct}
					class:wrong={selected && option === selected && option !== current.correct}
					disabled={!!selected}
					on:click={() => selectOption(option)}
				>
					{option}
				</button>
			{/each}
		</div>
	</div>
{/if}
