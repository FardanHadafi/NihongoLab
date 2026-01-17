<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import '../../../lib/style/dashboard.css';

	export let data: {
		dashboard: {
			user: {
				name: string;
				level: string;
				currentExp: number;
				nextLevelExp: number;
				progressPercent: number;
			};
			stats: {
				totalAnswered: number;
				accuracy: number;
			};
			today: {
				answeredToday: number;
			};
		};
	};

	const { user, stats, today } = data.dashboard;

	let progressBar: HTMLDivElement | null = null;

	onMount(() => {
		// Page entrance
		gsap.from('.dashboard-section', {
			opacity: 0,
			y: 24,
			duration: 0.6,
			ease: 'power2.out'
		});

		// Progress bar animation
		if (progressBar) {
			gsap.fromTo(
				progressBar,
				{ width: '0%' },
				{
					width: `${user.progressPercent}%`,
					duration: 1,
					ease: 'power3.out',
					delay: 0.3
				}
			);
		}

		// Stat cards animation
		const cards = document.querySelectorAll('.stat-card');
		gsap.from(cards, {
			opacity: 0,
			y: 20,
			stagger: 0.12,
			duration: 0.5,
			delay: 0.4,
			ease: 'power2.out'
		});
	});
</script>

<section class="dashboard-section">
	<!-- Header -->
	<header class="header">
		<h1>ようこそ, {user.name}</h1>
		<p class="subtitle">
			Level {user.level} · {user.currentExp}/{user.nextLevelExp} EXP
		</p>
	</header>

	<!-- Progress -->
	<div class="card">
		<div class="progress-header">
			<span>Learning Progress</span>
			<span>{user.progressPercent}%</span>
		</div>

		<div class="progress-track">
			<div class="progress-bar" bind:this={progressBar}></div>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<p class="label">Answered</p>
			<p class="value">{stats.totalAnswered}</p>
		</div>

		<div class="stat-card">
			<p class="label">Accuracy</p>
			<p class="value">{stats.accuracy}%</p>
		</div>

		<div class="stat-card">
			<p class="label">Today</p>
			<p class="value">{today.answeredToday}</p>
		</div>
	</div>
</section>
