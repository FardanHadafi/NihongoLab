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
			gsap.from('.stat-card', {
				duration: 0.6,
				y: 30,
				opacity: 0,
				stagger: 0.1,
				ease: 'power3.out'
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

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return '今日';
		if (diffDays === 1) return '昨日';
		return `${diffDays}日前`;
	}
</script>

<Navbar />

<div class="dashboard">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>読み込み中...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<h2>エラーが発生しました</h2>
			<p>{error}</p>
			<button class="retry-btn" on:click={fetchDashboardData}>再試行</button>
		</div>
	{:else if data}
		<div class="dashboard-header">
			<h1>ダッシュボード</h1>
			<p class="welcome">ようこそ、{data.user.name}さん！</p>
		</div>

		<!-- Level Progress Section -->
		<section class="level-section">
			<div class="level-card stat-card">
				<div class="level-header">
					<div class="current-level">
						<span class="level-label">現在のレベル</span>
						<span class="level-name">{data.user.currentLevel?.name || 'N5'}</span>
					</div>
					{#if data.user.nextLevel}
						<div class="next-level">
							<span class="next-label">次のレベル</span>
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
						次のレベルまで {(data.user.currentLevel?.requiredExp || 1000) - data.user.currentExp} XP
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
					<p class="stat-label">日連続</p>
				</div>
			</div>

			<div class="stat-card accuracy-card">
				<div class="stat-icon">🎯</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.stats.accuracyRate.toFixed(1)}%</h3>
					<p class="stat-label">正解率</p>
				</div>
			</div>

			<div class="stat-card total-card">
				<div class="stat-icon">📝</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.stats.totalAnswered}</h3>
					<p class="stat-label">解答済み</p>
				</div>
			</div>

			<div class="stat-card mastered-card">
				<div class="stat-icon">✅</div>
				<div class="stat-content">
					<h3 class="stat-value">{data.questionsMastered}</h3>
					<p class="stat-label">マスター済み</p>
				</div>
			</div>
		</section>

		<!-- Level Progress Breakdown -->
		<section class="level-breakdown">
			<h2>レベル別進捗</h2>
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
						<p class="level-percentage">{level.percentage.toFixed(1)}% 完了</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Recent Activity -->
		<section class="activity-section">
			<h2>最近の活動</h2>
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
				<p class="activity-footer">過去7日間の学習履歴</p>
			</div>
		</section>

		<!-- Quick Actions -->
		<section class="quick-actions">
			<h2>クイックアクション</h2>
			<div class="actions-grid">
				<a href="/practice" class="action-btn stat-card">
					<span class="action-icon">📚</span>
					<span class="action-text">練習を始める</span>
				</a>

				{#if data.questionsNeedingReview > 0}
					<a href="/review" class="action-btn stat-card review-btn">
						<span class="action-icon">🔄</span>
						<span class="action-text">復習 ({data.questionsNeedingReview})</span>
					</a>
				{/if}

				<a href="/vocabulary" class="action-btn stat-card">
					<span class="action-icon">📖</span>
					<span class="action-text">単語リスト</span>
				</a>
			</div>
		</section>
	{/if}
</div>
