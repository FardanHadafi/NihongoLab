<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import type { DashboardData } from '@nihongolab/db';
	import Navbar from '$lib/components/Navbar.svelte';

	let data: DashboardData | null = null;
	let loading = true;
	let error = '';

	let progressPercentage = 0;

	$: if (data?.user.currentLevel) {
		progressPercentage = (data.user.currentExp / data.user.currentLevel.requiredExp) * 100;
	}

	onMount(async () => {
		await fetchDashboardData();

		if (data) {
			// Animate cards in
			requestAnimationFrame(() => {
				gsap.fromTo(
					'.stat-card',
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						stagger: 0.1,
						ease: 'power3.out',
						clearProps: 'opacity,transform'
					}
				);
			});

			// Animate progress bar
			gsap.to('.progress-fill', {
				duration: 1.2,
				width: `${progressPercentage}%`,
				ease: 'power2.out',
				delay: 0.3
			});

			// Animate level bars
			gsap.from('.level-bar-fill', {
				duration: 1,
				width: 0,
				stagger: 0.15,
				ease: 'power2.out',
				delay: 0.5
			});
		}
	});

	async function fetchDashboardData() {
		try {
			loading = true;
			error = '';

			const response = await fetch('/api/dashboard', {
				credentials: 'include' // Important for auth cookies
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			data = await response.json();
		} catch (err) {
			console.error('Failed to fetch dashboard data:', err);
			error = err instanceof Error ? err.message : 'Failed to load dashboard data';
		} finally {
			loading = false;
		}
	}
</script>

<Navbar />

<div class="dashboard">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Loading...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<h2>An error has occurred</h2>
			<p>{error}</p>
			<button class="retry-btn" onclick={fetchDashboardData}>Retry</button>
		</div>
	{:else if data}
		<div class="dashboard-header">
			<h1>Dashboard</h1>
			<p class="welcome">ようこそ、{data.user.name}さん！</p>
		</div>

		<!-- Level Progress Section -->
		<section class="level-section">
			<div class="level-card stat-card">
				<div class="level-header">
					<div class="current-level">
						<span class="level-label">Current Level</span>
						<span class="level-name">{data.user.currentLevel?.name}</span>
					</div>
					{#if data.user.nextLevel}
						<div class="next-level">
							<span class="next-label">Next Level</span>
							<span class="next-name">{data.user.nextLevel.name}</span>
						</div>
					{/if}
				</div>

				<div class="exp-progress">
					<div class="exp-info">
						<span class="exp-current">{data.user.currentExp} XP</span>
						<span class="exp-required">/ {data.user.currentLevel?.requiredExp || 1000} XP</span>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 0%"></div>
					</div>
					<p class="exp-remaining">
						To the next level: {(data.user.currentLevel?.requiredExp || 1000) -
							data.user.currentExp} XP
					</p>
				</div>
			</div>
		</section>

		<!-- Stats Grid -->
		<section class="stats-grid">
			<div class="stat-card streak-card">
				<div class="stat-icon">🔥</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.stats.streak}</h3>
					<p class="stat-label">Consecutive Learning Streak</p>
				</div>
			</div>

			<div class="stat-card accuracy-card">
				<div class="stat-icon">🎯</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.stats.accuracyRate.toFixed(1)}%</h3>
					<p class="stat-label">Correct Answer Rate</p>
				</div>
			</div>

			<div class="stat-card total-card">
				<div class="stat-icon">📝</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.stats.totalAnswered}</h3>
					<p class="stat-label">Total Answered</p>
				</div>
			</div>

			<div class="stat-card mastered-card">
				<div class="stat-icon">✅</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.questionsMastered}</h3>
					<p class="stat-label">Total Mastered</p>
				</div>
			</div>
		</section>

		<!-- Level Progress Breakdown -->
		<section class="level-breakdown">
			<h2>Progress By Level</h2>
			<div class="level-list">
				{#each data.levelProgress as level}
					<div class="level-item stat-card">
						<div class="level-item-header">
							<h3 class="level-item-name">{level.levelName}</h3>
							<span class="level-item-stats">
								{level.answeredCorrect} / {level.totalQuestions}
							</span>
						</div>
						<div class="level-bar">
							<div class="level-bar-fill" style="width: {level.percentage}%"></div>
						</div>
						<p class="level-percentage">{level.percentage.toFixed(1)}% Completion</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Recent Activity -->
		<section class="activity-section">
			<h2>Recent Activities</h2>
			<div class="activity-card stat-card">
				<div class="activity-grid">
					{#each data.recentActivity.slice().reverse() as activity}
						<div class="activity-day" style="--intensity: {Math.min(activity.count / 30, 1)}">
							<div
								class="activity-bar"
								style="height: {Math.min((activity.count / 30) * 100, 100)}%"
							></div>
							<span class="activity-count">{activity.count}</span>
						</div>
					{/each}
				</div>
				<p class="activity-footer">Learning History (7 Days)</p>
			</div>
		</section>

		<!-- Quick Actions -->
		<section class="quick-actions">
			<h2>Quick Action</h2>
			<div class="actions-grid">
				<!-- <a href="/practice" class="action-btn stat-card">
					<span class="action-icon">📚</span>
					<span class="action-text">Start Practicing</span>
				</a> -->

				{#if data.questionsNeedingReview > 0}
					<a href="/review" class="action-btn stat-card review-btn">
						<span class="action-icon">🔄</span>
						<span class="action-text">Review ({data.questionsNeedingReview})</span>
					</a>
				{/if}

				<a href="/vocabulary" class="action-btn stat-card">
					<span class="action-icon">📖</span>
					<span class="action-text">Word List</span>
				</a>
			</div>
		</section>
	{/if}
</div>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		padding-bottom: 6rem;
	}

	.dashboard-header {
		margin-bottom: 3rem;
	}

	.dashboard-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.welcome {
		font-size: 1.1rem;
		color: #666;
	}

	section {
		margin-bottom: 3rem;
	}

	section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}

	/* Level Section */
	.level-card {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		padding: 2rem;
	}

	.level-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.current-level,
	.next-level {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.level-label,
	.next-label {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.level-name {
		font-size: 2rem;
		font-weight: 700;
	}

	.next-name {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.exp-progress {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.exp-info {
		display: flex;
		justify-content: space-between;
		font-size: 1rem;
	}

	.exp-current {
		font-weight: 600;
		font-size: 1.25rem;
	}

	.progress-bar {
		height: 12px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: white;
		border-radius: 6px;
		transition: width 0.3s ease;
	}

	.exp-remaining {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.stats-grid .stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stat-icon {
		font-size: 2.5rem;
	}

	.stat-content {
		flex: 1;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #666;
		margin: 0;
	}

	.streak-card {
		border-left: 4px solid #f97316;
	}

	.accuracy-card {
		border-left: 4px solid #10b981;
	}

	.total-card {
		border-left: 4px solid #3b82f6;
	}

	.mastered-card {
		border-left: 4px solid #8b5cf6;
	}

	/* Level Breakdown */
	.level-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.level-item {
		padding: 1.5rem;
	}

	.level-item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.level-item-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0;
	}

	.level-item-stats {
		font-size: 0.875rem;
		color: #666;
	}

	.level-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.level-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
		border-radius: 4px;
	}

	.level-percentage {
		font-size: 0.875rem;
		color: #666;
		margin: 0;
	}

	/* Recent Activity */
	.activity-card {
		padding: 2rem;
	}

	.activity-grid {
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.activity-day {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.activity-bar {
		width: 100%;
		min-height: 40px;
		max-height: 120px;
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		border-radius: 4px;
		transition: height 0.3s ease;
	}

	.activity-count {
		font-size: 0.75rem;
		color: #666;
		font-weight: 600;
	}

	.activity-footer {
		text-align: center;
		color: #666;
		font-size: 0.875rem;
		margin: 1rem 0 0;
	}

	/* Quick Actions */
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-decoration: none;
		color: #1a1a1a;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn:hover {
		transform: translateY(-4px);
	}

	.action-icon {
		font-size: 3rem;
	}

	.action-text {
		font-size: 1rem;
		font-weight: 600;
	}

	.review-btn {
		border: 2px solid #f97316;
	}

	@media (max-width: 768px) {
		.dashboard {
			padding: 1rem;
		}

		.dashboard-header h1 {
			font-size: 2rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.level-name {
			font-size: 2rem;
		}

		.activity-grid {
			gap: 0.25rem;
		}
	}

	/* Loading & Error States */
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		gap: 1.5rem;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #e5e7eb;
		border-top-color: #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-state p {
		font-size: 1.1rem;
		color: #666;
	}

	.error-state {
		text-align: center;
	}

	.error-icon {
		font-size: 4rem;
	}

	.error-state h2 {
		font-size: 1.5rem;
		color: #dc2626;
		margin: 0;
	}

	.error-state p {
		color: #666;
		margin: 0.5rem 0 1.5rem;
	}

	.retry-btn {
		padding: 0.75rem 2rem;
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.retry-btn:hover {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		transform: translateY(-2px);
	}
</style>
