<script lang="ts">
	import { goto } from '$app/navigation';

	let { data }: { data: { reviewCount: number } } = $props();
</script>

<section class="review-page">
	<h1>Review Your Japanese</h1>

	{#if data.reviewCount > 0}
		<div class="review-card">
			<p class="count">
				You have <strong>{data.reviewCount}</strong> question(s) to review.
			</p>

			<p class="hint">These are questions you answered incorrectly or needed multiple attempts.</p>

			<button onclick={() => goto("/review/start")} class="review-btn"> Start Review </button>
		</div>
	{:else}
		<div class="empty-state">
			<p>Great job!</p>
			<p>You have no questions to review right now.</p>

			<button onclick={() => goto("/practice")} class="practice-btn"> Practice More Japanese </button>
		</div>
	{/if}
</section>

<style>
	.review-page {
		max-width: 600px;
		margin: 3rem auto;
		padding: 1rem;
		text-align: center;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	.review-card,
	.empty-state {
		background: #ffffff;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	}

	.count {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.hint {
		color: #666;
		margin-bottom: 1.5rem;
	}

	.review-btn,
	.practice-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		text-decoration: none;
	}

	.review-btn {
		background: #e63946;
		color: white;
	}

	.practice-btn {
		background: #457b9d;
		color: white;
	}

	.review-btn:hover,
	.practice-btn:hover {
		opacity: 0.9;
	}
</style>
