<script lang="ts">
	import { goto } from '$app/navigation';
	let activeLevel = 'beginner';

	const levels = [
		{ id: 'beginner', name: 'Beginner' }
		// { id: 'intermediate', name: 'Intermediate'},
		// { id: 'advanced', name: 'Advanced'}
	];

	const curriculum = {
		beginner: {
			title: 'Beginner Level',
			subtitle: 'Build your foundation in Japanese',
			duration: '3-6 months',
			modules: [
				{
					number: '01',
					title: 'Hiragana Mastery',
					lessons: 12,
					duration: '2 weeks',
					topics: ['46 Basic Characters', 'Stroke Order', 'Reading Practice', 'Writing Exercises'],
					color: '#dc2626'
				},
				{
					number: '02',
					title: 'Katakana Mastery',
					lessons: 12,
					duration: '2 weeks',
					topics: ['46 Basic Characters', 'Foreign Words', 'Modern Usage', 'Practice Drills'],
					color: '#f97316'
				},
				{
					number: '03',
					title: 'Basic Grammar',
					lessons: 24,
					duration: '6 weeks',
					topics: [
						'Particles (は, が, を)',
						'Verb Conjugation',
						'Adjectives',
						'Sentence Structure'
					],
					color: '#ec4899'
				},
				{
					number: '04',
					title: 'Essential Vocabulary',
					lessons: 20,
					duration: '4 weeks',
					topics: ['Numbers & Counting', 'Daily Expressions', 'Common Verbs', 'Basic Nouns'],
					color: '#8b5cf6'
				},
				{
					number: '05',
					title: 'Introduction to Kanji',
					lessons: 30,
					duration: '8 weeks',
					topics: ['JLPT N5 Kanji (80)', 'Radicals', 'Readings', 'Mnemonics'],
					color: '#0ea5e9'
				}
			]
		}
		// intermediate: {
		//     title: 'Intermediate Level',
		//     subtitle: 'Expand your Japanese skills',
		//     duration: '6-12 months',
		//     modules: [
		//         {
		//             number: '01',
		//             title: 'Advanced Grammar',
		//             lessons: 36,
		//             duration: '10 weeks',
		//             topics: ['Complex Particles', 'Keigo (Honorifics)', 'Conditional Forms', 'Passive & Causative'],
		//             color: '#dc2626'
		//         },
		//         {
		//             number: '02',
		//             title: 'JLPT N4/N3 Kanji',
		//             lessons: 48,
		//             duration: '12 weeks',
		//             topics: ['300+ New Kanji', 'Compound Words', 'Multiple Readings', 'Context Usage'],
		//             color: '#f97316'
		//         },
		//         {
		//             number: '03',
		//             title: 'Conversational Skills',
		//             lessons: 28,
		//             duration: '8 weeks',
		//             topics: ['Natural Expressions', 'Casual vs Formal', 'Listening Practice', 'Pronunciation'],
		//             color: '#ec4899'
		//         },
		//         {
		//             number: '04',
		//             title: 'Reading Comprehension',
		//             lessons: 32,
		//             duration: '10 weeks',
		//             topics: ['Short Stories', 'News Articles', 'Manga & Comics', 'Cultural Texts'],
		//             color: '#8b5cf6'
		//         },
		//         {
		//             number: '05',
		//             title: 'Writing Practice',
		//             lessons: 24,
		//             duration: '8 weeks',
		//             topics: ['Essay Structure', 'Formal Letters', 'Creative Writing', 'Composition Tips'],
		//             color: '#0ea5e9'
		//         }
		//     ]
		// },
		// advanced: {
		//     title: 'Advanced Level',
		//     subtitle: 'Achieve Japanese mastery',
		//     duration: '12+ months',
		//     modules: [
		//         {
		//             number: '01',
		//             title: 'JLPT N2/N1 Kanji',
		//             lessons: 60,
		//             duration: '16 weeks',
		//             topics: ['1000+ Advanced Kanji', 'Literary Usage', 'Technical Terms', 'Classical References'],
		//             color: '#dc2626'
		//         },
		//         {
		//             number: '02',
		//             title: 'Business Japanese',
		//             lessons: 40,
		//             duration: '12 weeks',
		//             topics: ['Keigo Mastery', 'Email Writing', 'Presentations', 'Negotiations'],
		//             color: '#f97316'
		//         },
		//         {
		//             number: '03',
		//             title: 'Advanced Reading',
		//             lessons: 36,
		//             duration: '10 weeks',
		//             topics: ['Novels', 'Academic Papers', 'Technical Documents', 'Classical Literature'],
		//             color: '#ec4899'
		//         },
		//         {
		//             number: '04',
		//             title: 'Native-Level Speaking',
		//             lessons: 32,
		//             duration: '10 weeks',
		//             topics: ['Dialects', 'Idioms & Slang', 'Debate Skills', 'Natural Flow'],
		//             color: '#8b5cf6'
		//         },
		//         {
		//             number: '05',
		//             title: 'Cultural Mastery',
		//             lessons: 28,
		//             duration: '8 weeks',
		//             topics: ['History & Traditions', 'Social Etiquette', 'Pop Culture', 'Regional Differences'],
		//             color: '#0ea5e9'
		//         }
		//     ]
		// }
	};

	$: currentCurriculum = curriculum[activeLevel];
</script>

<!-- Level Selector -->
<section class="level-selector">
	<div class="container">
		<div class="level-tabs">
			{#each levels as level}
				<button
					class="level-tab"
					class:active={activeLevel === level.id}
					onclick={() => (activeLevel = level.id)}
				>
					<span class="tab-name">{level.name}</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<div class="curriculum-page">
	<!-- Hero Section -->
	<section class="curriculum-hero">
		<div class="hero-content">
			<!--            <div class="badge">-->
			<!--                <span class="badge-icon">📖</span>-->
			<!--                <span>Complete Curriculum</span>-->
			<!--            </div>-->
			<h1 class="hero-title">
				Master Japanese
				<span class="gradient-text">Step by Step</span>
			</h1>
			<p class="hero-description">
				Our comprehensive curriculum takes you from complete beginner to advanced fluency with
				structured lessons, interactive exercises, and cultural insights at every level.
			</p>
		</div>
	</section>

	<!-- Curriculum Content -->
	<section class="curriculum-content">
		<div class="container">
			<div class="content-header">
				<h2 class="content-title">{currentCurriculum.title}</h2>
				<p class="content-subtitle">{currentCurriculum.subtitle}</p>
				<div class="duration-badge">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M8 4V8L11 10"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					<span>Estimated Duration: {currentCurriculum.duration}</span>
				</div>
			</div>

			<div class="modules-grid">
				{#each currentCurriculum.modules as module}
					<div class="module-card">
						<div class="module-header" style="--module-color: {module.color}">
							<div class="module-number">{module.number}</div>
							<div class="module-info">
								<h3 class="module-title">{module.title}</h3>
								<div class="module-meta">
									<span class="meta-item">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
											<path
												d="M7 1L9 5L13 5.5L10 8.5L11 13L7 11L3 13L4 8.5L1 5.5L5 5L7 1Z"
												fill="currentColor"
											/>
										</svg>
										{module.lessons} Lessons
									</span>
									<span class="meta-divider">•</span>
									<span class="meta-item">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
											<circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2" />
											<path
												d="M7 3V7L10 9"
												stroke="currentColor"
												stroke-width="1.2"
												stroke-linecap="round"
											/>
										</svg>
										{module.duration}
									</span>
								</div>
							</div>
						</div>
						<div class="module-topics">
							<h4 class="topics-title">What you'll learn:</h4>
							<ul class="topics-list">
								{#each module.topics as topic}
									<li class="topic-item">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
											<path
												d="M13 4L6 11L3 8"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
										{topic}
									</li>
								{/each}
							</ul>
						</div>
						<!--                        <button class="module-btn">-->
						<!--                            Start Module-->
						<!--                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">-->
						<!--                                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
						<!--                            </svg>-->
						<!--                        </button>-->
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="features-section">
		<div class="container">
			<h2 class="features-title">Why Our Curriculum Works</h2>
			<div class="features-grid">
				<div class="feature-item">
					<div class="feature-icon">🎯</div>
					<h3 class="feature-title">Structured Learning</h3>
					<p class="feature-text">
						Follow a proven path from basics to advanced, with clear milestones and progress
						tracking.
					</p>
				</div>
				<div class="feature-item">
					<div class="feature-icon">🧠</div>
					<h3 class="feature-title">Spaced Repetition</h3>
					<p class="feature-text">
						Our system uses proven SRS algorithms to optimize retention and long-term memory.
					</p>
				</div>
				<div class="feature-item">
					<div class="feature-icon">🎮</div>
					<h3 class="feature-title">Interactive Practice</h3>
					<p class="feature-text">
						Engage with quizzes, games, and real-world scenarios to reinforce your learning.
					</p>
				</div>
				<div class="feature-item">
					<div class="feature-icon">📊</div>
					<h3 class="feature-title">Progress Analytics</h3>
					<p class="feature-text">
						Track your improvement with detailed stats and personalized recommendations.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta-section">
		<div class="container">
			<div class="cta-content">
				<h2 class="cta-title">Ready to Begin Your Journey?</h2>
				<p class="cta-text">Start with our beginner course and work your way to fluency</p>
				<div class="cta-buttons">
					<button class="btn btn-primary" onclick={() => goto('/sign-up')}>
						Start Learning Now
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M7.5 15L12.5 10L7.5 5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* ===== Level Selector ===== */
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.level-selector {
		/* background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%); */
		padding: 1rem;
		position: sticky;
		z-index: 100;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.level-tabs {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.level-tab {
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 10px 24px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.level-tab:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.level-tab.active {
		background: white;
		color: #dc2626;
		border-color: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.tab-name {
		display: block;
	}

	/* ===== Curriculum Page Layout ===== */
	.curriculum-page {
		min-height: 100vh;
		background: #ffffff;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* ===== Hero Section ===== */
	.curriculum-hero {
		padding: 140px 20px 80px;
		text-align: center;
		background: linear-gradient(135deg, #fef3f5 0%, #fef9fc 50%, #f0f4ff 100%);
		color: #0f172a;
		position: relative;
		overflow: hidden;
	}

	.curriculum-hero::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(220, 38, 38, 0.05) 1px, transparent 1px);
		background-size: 50px 50px;
		opacity: 0.5;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 800px;
		margin: 0 auto;
	}

	/* .badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(220, 38, 38, 0.2);
		padding: 8px 16px;
		border-radius: 50px;
		font-size: 14px;
		font-weight: 500;
		color: #dc2626;
		margin-bottom: 24px;
		backdrop-filter: blur(10px);
	} */

	/* .badge-icon {
		font-size: 16px;
	} */

	.hero-title {
		font-size: 64px;
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 24px;
		color: #0f172a;
	}

	.gradient-text {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		display: inline-block;
	}

	.hero-description {
		font-size: 18px;
		line-height: 1.7;
		color: #64748b;
		max-width: 600px;
		margin: 0 auto;
	}

	/* ===== Curriculum Content ===== */
	.curriculum-content {
		padding: 100px 20px;
		background: linear-gradient(180deg, #ffffff 0%, #fef9fc 50%, #f0f4ff 100%);
	}

	.content-header {
		text-align: center;
		margin-bottom: 60px;
	}

	.content-title {
		font-size: 48px;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 20px;
		line-height: 1.2;
	}

	.content-subtitle {
		font-size: 18px;
		color: #64748b;
		margin-bottom: 32px;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.7;
	}

	.duration-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(220, 38, 38, 0.2);
		padding: 12px 20px;
		border-radius: 50px;
		color: #dc2626;
		font-size: 14px;
		font-weight: 600;
		backdrop-filter: blur(10px);
	}

	.duration-badge svg {
		color: #dc2626;
		flex-shrink: 0;
	}

	/* ===== Modules Grid ===== */
	.modules-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 30px;
		margin-top: 40px;
	}

	.module-card {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		border: 1px solid rgba(226, 232, 240, 0.8);
	}

	.module-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 20px 60px rgba(220, 38, 38, 0.12);
		border-color: rgba(220, 38, 38, 0.2);
	}

	.module-header {
		background: var(--module-color, #dc2626);
		padding: 32px 28px;
		color: white;
		display: flex;
		align-items: flex-start;
		gap: 20px;
		position: relative;
		overflow: hidden;
	}

	.module-header::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -20%;
		width: 200px;
		height: 200px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		filter: blur(60px);
	}

	.module-number {
		background: rgba(255, 255, 255, 0.2);
		width: 56px;
		height: 56px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 700;
		flex-shrink: 0;
		backdrop-filter: blur(10px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		position: relative;
		z-index: 1;
	}

	.module-info {
		flex: 1;
		position: relative;
		z-index: 1;
	}

	.module-title {
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 12px;
		line-height: 1.3;
	}

	.module-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		opacity: 0.95;
		font-weight: 500;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.meta-divider {
		opacity: 0.6;
		margin: 0 4px;
	}

	.module-topics {
		padding: 28px;
	}

	.topics-title {
		font-size: 14px;
		font-weight: 700;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
	}

	.topics-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.topic-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		color: #0f172a;
		font-size: 15px;
		line-height: 1.6;
	}

	.topic-item svg {
		color: #10b981;
		flex-shrink: 0;
		margin-top: 2px;
	}

	/* .module-btn {
		width: 100%;
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		border: none;
		padding: 16px 24px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.3s ease;
	} */

	/* .module-btn:hover {
		background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
		gap: 12px;
	} */

	/* ===== Features Section ===== */
	.features-section {
		padding: 100px 20px;
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
		border-top: 1px solid rgba(220, 38, 38, 0.1);
	}

	.features-title {
		font-size: 48px;
		font-weight: 800;
		text-align: center;
		color: #0f172a;
		margin-bottom: 60px;
		line-height: 1.2;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 30px;
	}

	.feature-item {
		background: white;
		padding: 36px 28px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;
		border: 1px solid rgba(226, 232, 240, 0.8);
	}

	.feature-item:hover {
		transform: translateY(-8px);
		box-shadow: 0 20px 60px rgba(220, 38, 38, 0.12);
		border-color: rgba(220, 38, 38, 0.2);
	}

	.feature-icon {
		font-size: 48px;
		margin-bottom: 20px;
	}

	.feature-title {
		font-size: 20px;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 12px;
	}

	.feature-text {
		color: #64748b;
		line-height: 1.7;
		font-size: 15px;
	}

	/* ===== CTA Section ===== */
	.cta-section {
		padding: 50px 20px;
		background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%);
		color: white;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.cta-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
		opacity: 0.5;
	}

	.cta-content {
		position: relative;
		z-index: 1;
		max-width: 700px;
		margin: 0 auto;
	}

	.cta-title {
		font-size: 48px;
		font-weight: 800;
		margin-bottom: 20px;
		line-height: 1.2;
	}

	.cta-text {
		font-size: 18px;
		opacity: 0.95;
		margin-bottom: 40px;
		line-height: 1.7;
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	.btn {
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 600;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: none;
	}

	.btn-primary {
		background: white;
		color: #dc2626;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	.btn-primary:hover {
		background: #f8fafc;
		transform: translateY(-2px);
		box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
		gap: 12px;
	}

	/* .btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
	} */

	/* ===== Responsive Design ===== */
	@media (max-width: 968px) {
		.hero-title {
			font-size: 48px;
		}

		.content-title,
		.features-title,
		.cta-title {
			font-size: 36px;
		}

		.hero-description,
		.content-subtitle,
		.cta-text {
			font-size: 16px;
		}

		.modules-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.features-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}

		.level-tab {
			padding: 10px 20px;
			font-size: 14px;
		}
	}

	@media (max-width: 640px) {
		.curriculum-hero {
			padding: 100px 20px 60px;
		}

		.hero-title {
			font-size: 36px;
		}

		.content-title,
		.features-title {
			font-size: 32px;
		}

		.cta-title {
			font-size: 32px;
		}

		.curriculum-content,
		.features-section,
		.cta-section {
			padding: 60px 20px;
		}

		.module-header {
			padding: 24px 20px;
			gap: 16px;
		}

		.module-number {
			width: 48px;
			height: 48px;
			font-size: 20px;
		}

		.module-title {
			font-size: 20px;
		}

		.module-topics {
			padding: 24px 20px;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.level-selector {
			top: 61px;
		}

		.level-tabs {
			gap: 8px;
			padding: 0 16px;
		}

		.level-tab {
			padding: 8px 16px;
			font-size: 13px;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.hero-title {
			font-size: 28px;
		}

		.content-title,
		.features-title,
		.cta-title {
			font-size: 28px;
		}

		.module-header {
			padding: 20px 16px;
		}

		.module-number {
			width: 44px;
			height: 44px;
			font-size: 18px;
		}

		.module-title {
			font-size: 18px;
		}

		.module-topics {
			padding: 20px 16px;
		}
	}
</style>
