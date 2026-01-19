<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import '../../../lib/style/dashboard.css';
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
					<p class="stat-label">Consecutive Streak</p>
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
				<a href="/practice" class="action-btn stat-card">
					<span class="action-icon">📚</span>
					<span class="action-text">Start Practicing</span>
				</a>

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
