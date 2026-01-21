<script lang="ts">
	import { goto } from '$app/navigation';
	let email = '';
	let mobileMenuOpen = false;

	function handleNewsletterSubmit(e: Event) {
		e.preventDefault();
		console.log('Newsletter signup:', email);
		email = '';
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	const features = [
		{
			icon: '📚',
			title: 'Comprehensive Curriculum',
			description:
				'From beginner to advanced, master all aspects of Japanese including hiragana, katakana, kanji, grammar, and conversation.'
		},
		{
			icon: '🎯',
			title: 'Interactive Learning',
			description:
				'Engage with interactive exercises, quizzes, and real-time feedback to accelerate your learning journey.'
		},
		{
			icon: '🌸',
			title: 'Cultural Immersion',
			description:
				'Dive deep into Japanese culture, traditions, and customs while learning the language authentically.'
		}
	];

	// const stats = [
	// 	{ number: '2,000+', label: 'Kanji Lessons' },
	// 	{ number: '500+', label: 'Grammar Points' },
	// ];

	const timeline = [
		{
			level: 'Beginner',
			title: 'Foundation',
			description:
				'Master hiragana and katakana, learn basic grammar, and start simple conversations.',
			duration: '3-6 months'
		},
		{
			level: 'Intermediate',
			title: 'Building Skills',
			description: 'Expand vocabulary, tackle essential kanji, and develop conversational fluency.',
			duration: '6-12 months'
		},
		{
			level: 'Advanced',
			title: 'Mastery',
			description: 'Read complex texts, understand native content, and communicate professionally.',
			duration: '12+ months'
		}
	];
</script>

<div class="page-wrapper">
	<!-- Navbar -->
	<nav class="navbar">
		<div class="nav-container">
			<div class="nav-logo">
				<span class="logo-jp">日本語</span>
				<span class="logo-name">NihongoLab</span>
			</div>

			<div class="nav-links" class:active={mobileMenuOpen}>
				<a href="#home" onclick={toggleMobileMenu}>Home</a>
				<a href="#about" onclick={toggleMobileMenu}>About</a>
				<a href="#contact" onclick={toggleMobileMenu}>Contact</a>

				<div class="nav-btn-mobile">
					<a href="/sign-up" class="btn-signup">Sign Up</a>
					<a href="/sign-in" class="btn-signin">Sign In</a>
				</div>
			</div>

			<div class="nav-btn nav-btn-desktop">
				<a href="/sign-up" class="btn-signup">Sign Up</a>
				<a href="/sign-in" class="btn-signin">Sign In</a>
			</div>

			<button
				class="mobile-toggle"
				class:active={mobileMenuOpen}
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="hero" id="home">
		<div class="hero-content">
			<div class="hero-text">
				<!-- <div class="badge">
					<span class="badge-icon">✨</span>
					<span>Master Japanese with Confidence</span>
				</div> -->

				<h1 class="hero-title">
					Learn Japanese
					<span class="gradient-text">Naturally</span>
				</h1>

				<p class="hero-description">
					Master hiragana, katakana, and kanji through interactive lessons, real conversations, and
					cultural insights. Your journey to fluency starts here.
				</p>

				<div class="hero-buttons">
					<button class="btn btn-primary" onclick={() => goto('/sign-up')}>
						Start Learning Free
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

				<!--				<div class="hero-stats">-->
				<!--					<div class="stat">-->
				<!--						<div class="stat-number">50K+</div>-->
				<!--						<div class="stat-label">Active Learners</div>-->
				<!--					</div>-->
				<!--					<div class="stat-divider"></div>-->
				<!--					<div class="stat">-->
				<!--						<div class="stat-number">2,000+</div>-->
				<!--						<div class="stat-label">Kanji Characters</div>-->
				<!--					</div>-->
				<!--					<div class="stat-divider"></div>-->
				<!--					<div class="stat">-->
				<!--						<div class="stat-number">4.9★</div>-->
				<!--						<div class="stat-label">User Rating</div>-->
				<!--					</div>-->
				<!--				</div>-->
			</div>

			<div class="hero-visual">
				<div class="floating-card card-1">
					<div class="card-icon">あ</div>
					<div class="card-text">
						<div class="card-title">Hiragana</div>
						<div class="card-subtitle">Basic Characters</div>
					</div>
				</div>

				<div class="floating-card card-2">
					<div class="card-icon">カ</div>
					<div class="card-text">
						<div class="card-title">Katakana</div>
						<div class="card-subtitle">Foreign Words</div>
					</div>
				</div>

				<div class="floating-card card-3">
					<div class="card-icon">漢</div>
					<div class="card-text">
						<div class="card-title">Kanji</div>
						<div class="card-subtitle">Complex Characters</div>
					</div>
				</div>

				<div class="circle-decoration circle-1"></div>
				<div class="circle-decoration circle-2"></div>
			</div>
		</div>
	</section>

	<section class="about-section" id="about">
		<div class="about-container">
			<!-- Section Header -->
			<div class="section-header">
				<h2 class="section-title">
					Your Journey to
					<span class="gradient-text">Japanese Fluency</span>
				</h2>
				<p class="section-description">
					NihongoLab is more than just a learning platform—it's your companion on the path to
					mastering Japanese. We combine cutting-edge technology with proven teaching methods to
					make learning Japanese accessible, engaging, and effective for everyone.
				</p>
			</div>

			<!-- Features Grid -->
			<div class="features-grid">
				{#each features as feature}
					<div class="feature-card">
						<div class="feature-icon">{feature.icon}</div>
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-description">{feature.description}</p>
					</div>
				{/each}
			</div>

			<!--			&lt;!&ndash; Stats Section &ndash;&gt;-->
			<!--			<div class="stats-section">-->
			<!--				<div class="stats-grid">-->
			<!--					{#each stats as stat}-->
			<!--						<div class="stat-item">-->
			<!--							<div class="stat-number">{stat.number}</div>-->
			<!--							<div class="stat-label">{stat.label}</div>-->
			<!--						</div>-->
			<!--					{/each}-->
			<!--				</div>-->
			<!--			</div>-->

			<!-- Learning Path -->
			<div class="learning-path">
				<h3 class="path-title">Your Learning Path</h3>
				<p class="path-subtitle">Progress through structured levels designed for your success</p>

				<div class="timeline">
					{#each timeline as step, index}
						<div class="timeline-item">
							<div class="timeline-marker">
								<span class="marker-number">{index + 1}</span>
							</div>
							<div class="timeline-content">
								<div class="timeline-badge">{step.level}</div>
								<h4 class="timeline-title">{step.title}</h4>
								<p class="timeline-description">{step.description}</p>
								<div class="timeline-duration">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
										<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
										<path
											d="M8 4V8L11 10"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>
									<span>{step.duration}</span>
								</div>
							</div>
							{#if index < timeline.length - 1}
								<div class="timeline-connector"></div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Mission Statement -->
			<div class="mission-section">
				<div class="mission-content">
					<div class="mission-text">
						<h3 class="mission-title">Our Mission</h3>
						<p class="mission-description">
							We believe that learning Japanese should be accessible to everyone, regardless of
							their background or learning style. Our mission is to break down language barriers and
							foster cultural understanding through innovative, personalized learning experiences.
						</p>
						<p class="mission-description">
							Every lesson is crafted with care by experienced educators and native speakers,
							ensuring you learn authentic Japanese that you can use in real-world situations.
						</p>
					</div>
					<div class="mission-visual">
						<div class="visual-card card-primary">
							<div class="visual-icon">🗾</div>
							<div class="visual-text">Cultural Authenticity</div>
						</div>
						<div class="visual-card card-secondary">
							<div class="visual-icon">💡</div>
							<div class="visual-text">Modern Methods</div>
						</div>
						<div class="visual-card card-tertiary">
							<div class="visual-icon">🎯</div>
							<div class="visual-text">Proven Results</div>
						</div>
					</div>
				</div>
			</div>

			<!-- CTA Section -->
			<div class="cta-section">
				<h3 class="cta-title">Ready to Start Your Journey?</h3>
				<p class="cta-description">
					Join thousands of students already learning Japanese with NihongoLab
				</p>
				<div class="cta-buttons">
					<button class="btn btn-primary" onclick={() => goto('/sign-up')}>
						Start Learning Free
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
					<button class="btn btn-secondary" onclick={() => goto('/curriculum')}
						>View Curriculum</button
					>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="footer" id="contact">
		<div class="footer-content">
			<div class="footer-top">
				<div class="footer-brand">
					<div class="footer-logo">
						<span class="logo-text">日本語</span>
						<span class="logo-subtext">NihongoLab</span>
					</div>
					<p class="footer-tagline">
						Your trusted companion for mastering the Japanese language through innovative learning
						methods and cultural immersion.
					</p>
					<div class="social-links">
						<a
							href="https://discord.com/users/305967766031171585"
							class="social-link"
							aria-label="Discord"
							target="_blank"
							rel="noopener norefferrer"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
								/>
							</svg>
						</a>
						<a
							href="https://github.com/FardanHadafi"
							class="social-link"
							aria-label="Github"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
						</a>
					</div>
				</div>

				<div class="footer-links">
					<div class="footer-column">
						<h3 class="footer-title">Learn</h3>
						<ul class="footer-list">
							<li><a href="#contact">Hiragana</a></li>
							<li><a href="#contact">Katakana</a></li>
							<li><a href="#contact">Kanji</a></li>
							<li><a href="#contact">Grammar</a></li>
							<li><a href="#contact">Vocabulary</a></li>
						</ul>
					</div>

					<!-- <div class="footer-column">
						<h3 class="footer-title">Resources</h3>
						<ul class="footer-list">
							<li><a href="#">Study Guides</a></li>
							<li><a href="#">Practice Tests</a></li>
							<li><a href="#">Audio Lessons</a></li>
							<li><a href="#">Culture Blog</a></li>
							<li><a href="#">Community</a></li>
						</ul>
					</div> -->

					<!-- <div class="footer-column">
						<h3 class="footer-title">Company</h3>
						<ul class="footer-list">
							<li><a href="#">About Us</a></li>
							<li><a href="#">Careers</a></li>
							<li><a href="#">Press Kit</a></li>
							<li><a href="#">Contact</a></li>
							<li><a href="#">Support</a></li>
						</ul>
					</div> -->

					<!-- <div class="footer-column">
						<h3 class="footer-title">Newsletter</h3>
						<p class="newsletter-text">Get weekly Japanese tips and cultural insights.</p>
						<form class="newsletter-form" onsubmit={handleNewsletterSubmit}>
							<input
								type="email"
								placeholder="Enter your email"
								bind:value={email}
								required
								class="newsletter-input"
							/>
							<button type="submit" class="newsletter-button"> Subscribe </button>
						</form>
					</div> -->
				</div>
			</div>

			<div class="footer-bottom">
				<p class="copyright">© 2026 NihongoLab. All rights reserved.</p>
				<!-- <div class="footer-legal">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
					<a href="#">Cookie Policy</a>
				</div> -->
			</div>
		</div>
	</footer>
</div>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.page-wrapper {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		color: #1a1a1a;
		background: #ffffff;
	}

	/* Navbar Styles */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(226, 232, 240, 0.6);
		z-index: 1000;
		transition: all 0.3s ease;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 16px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		z-index: 1001;
	}

	.logo-jp {
		font-size: 24px;
		color: #0f172a;
	}

	.logo-name {
		font-size: 20px;
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nav-links {
		display: flex;
		gap: 32px;
		align-items: center;
		transition: all 0.3s ease;
	}

	.nav-links a {
		color: #475569;
		text-decoration: none;
		font-size: 15px;
		font-weight: 500;
		transition: color 0.3s ease;
		position: relative;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #dc2626, #ec4899);
		transition: width 0.3s ease;
	}

	.nav-links a:hover {
		color: #dc2626;
	}

	.nav-links a:hover::after {
		width: 100%;
	}

	.nav-btn {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.nav-btn-mobile {
		display: none;
	}

	.nav-btn-desktop {
		display: flex;
	}

	.btn-signup {
		padding: 10px 20px;
		color: #475569;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		border-radius: 8px;
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.btn-signup:hover {
		color: #dc2626;
		background: rgba(220, 38, 38, 0.05);
	}

	.btn-signin {
		padding: 10px 24px;
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		border-radius: 8px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 10px rgba(220, 38, 38, 0.2);
		white-space: nowrap;
	}

	.btn-signin:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
	}

	.mobile-toggle {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		z-index: 1001;
	}

	.mobile-toggle span {
		width: 24px;
		height: 2px;
		background: #475569;
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.mobile-toggle.active span:nth-child(1) {
		transform: rotate(45deg) translate(7px, 7px);
	}

	.mobile-toggle.active span:nth-child(2) {
		opacity: 0;
	}

	.mobile-toggle.active span:nth-child(3) {
		transform: rotate(-45deg) translate(7px, -7px);
	}

	/* Hero Section */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 140px 20px 80px;
		background: linear-gradient(135deg, #fef3f5 0%, #fef9fc 50%, #f0f4ff 100%);
		overflow: hidden;
	}

	.hero-content {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}

	.hero-text {
		z-index: 2;
	}

	/* .badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(220, 38, 38, 0.2);
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
	}

	.hero-description {
		font-size: 18px;
		line-height: 1.7;
		color: #64748b;
		margin-bottom: 32px;
		max-width: 540px;
	}

	.hero-buttons {
		display: flex;
		gap: 16px;
		margin-bottom: 48px;
		flex-wrap: wrap;
	}

	.btn {
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 30px rgba(220, 38, 38, 0.4);
	}

	.btn-secondary {
		background: white;
		color: #0f172a;
		border: 2px solid #e2e8f0;
	}

	.btn-secondary:hover {
		border-color: #cbd5e1;
		transform: translateY(-2px);
	}

	/* .hero-stats {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.stat {
		text-align: left;
	}

	.stat-number {
		font-size: 28px;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 4px;
	}

	.stat-label {
		font-size: 14px;
		color: #64748b;
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: #e2e8f0;
	} */

	/* Hero Visual */
	.hero-visual {
		position: relative;
		height: 500px;
	}

	.floating-card {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px 24px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
		animation: float 3s ease-in-out infinite;
	}

	.card-1 {
		top: 50px;
		left: 50px;
		animation-delay: 0s;
	}

	.card-2 {
		top: 180px;
		right: 80px;
		animation-delay: 0.5s;
	}

	.card-3 {
		bottom: 80px;
		left: 100px;
		animation-delay: 1s;
	}

	.card-icon {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		font-weight: 700;
		background: linear-gradient(135deg, #fef3f5 0%, #f0f4ff 100%);
		border-radius: 12px;
	}

	.card-title {
		font-size: 18px;
		font-weight: 600;
		color: #0f172a;
		margin-bottom: 4px;
	}

	.card-subtitle {
		font-size: 14px;
		color: #64748b;
	}

	.circle-decoration {
		position: absolute;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		filter: blur(60px);
	}

	.circle-1 {
		width: 300px;
		height: 300px;
		top: -50px;
		right: -50px;
	}

	.circle-2 {
		width: 250px;
		height: 250px;
		bottom: -50px;
		left: -50px;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.about-section {
		padding: 100px 20px;
		background: linear-gradient(180deg, #ffffff 0%, #fef9fc 50%, #f0f4ff 100%);
		position: relative;
		overflow: hidden;
	}

	.about-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Section Header */
	.section-header {
		text-align: center;
		margin-bottom: 80px;
	}

	/* .badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(220, 38, 38, 0.2);
		border-radius: 50px;
		font-size: 14px;
		font-weight: 500;
		color: #dc2626;
		margin-bottom: 20px;
		backdrop-filter: blur(10px);
	} */

	/* .badge-icon {
		font-size: 16px;
	} */

	.section-title {
		font-size: 48px;
		font-weight: 800;
		line-height: 1.2;
		color: #0f172a;
		margin-bottom: 20px;
	}

	.gradient-text {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.section-description {
		font-size: 18px;
		line-height: 1.7;
		color: #64748b;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Features Grid */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 30px;
		margin-bottom: 80px;
	}

	.feature-card {
		background: white;
		padding: 36px 28px;
		border-radius: 20px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(226, 232, 240, 0.8);
		transition: all 0.3s ease;
	}

	.feature-card:hover {
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

	.feature-description {
		font-size: 15px;
		line-height: 1.7;
		color: #64748b;
		margin: 0;
	}

	/* Stats Section .stats-section {
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
		border-radius: 24px;
		padding: 60px 40px;
		margin-bottom: 80px;
		border: 1px solid rgba(220, 38, 38, 0.1);
	} */

	/* .stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 40px;
	}

	.stat-item {
		text-align: center;
	}

	.stat-number {
		font-size: 42px;
		font-weight: 800;
		background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 8px;
	}

	.stat-label {
		font-size: 16px;
		color: #64748b;
		font-weight: 500;
	} */

	/* Learning Path */
	.learning-path {
		margin-bottom: 80px;
	}

	.path-title {
		font-size: 36px;
		font-weight: 700;
		color: #0f172a;
		text-align: center;
		margin-bottom: 12px;
	}

	.path-subtitle {
		font-size: 18px;
		color: #64748b;
		text-align: center;
		margin-bottom: 60px;
	}

	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
	}

	.timeline-item {
		position: relative;
		padding-left: 80px;
		margin-bottom: 60px;
	}

	.timeline-marker {
		position: absolute;
		left: 0;
		top: 0;
		width: 56px;
		height: 56px;
		background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
	}

	.marker-number {
		font-size: 24px;
		font-weight: 700;
		color: white;
	}

	.timeline-connector {
		position: absolute;
		left: 27px;
		top: 56px;
		width: 2px;
		height: calc(100% + 4px);
		background: linear-gradient(180deg, #dc2626 0%, #ec4899 100%);
		opacity: 0.2;
	}

	.timeline-content {
		background: white;
		padding: 28px;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(226, 232, 240, 0.8);
	}

	.timeline-badge {
		display: inline-block;
		padding: 6px 14px;
		background: rgba(220, 38, 38, 0.1);
		color: #dc2626;
		font-size: 13px;
		font-weight: 600;
		border-radius: 6px;
		margin-bottom: 12px;
	}

	.timeline-title {
		font-size: 22px;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 10px;
	}

	.timeline-description {
		font-size: 15px;
		line-height: 1.7;
		color: #64748b;
		margin-bottom: 16px;
	}

	.timeline-duration {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #94a3b8;
		font-weight: 500;
	}

	.timeline-duration svg {
		color: #dc2626;
	}

	/* Mission Section */
	.mission-section {
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
		border-radius: 24px;
		padding: 60px;
		margin-bottom: 80px;
	}

	.mission-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}

	.mission-title {
		font-size: 32px;
		font-weight: 700;
		color: white;
		margin-bottom: 20px;
	}

	.mission-description {
		font-size: 16px;
		line-height: 1.8;
		color: #cbd5e1;
		margin-bottom: 20px;
	}

	.mission-description:last-child {
		margin-bottom: 0;
	}

	.mission-visual {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.visual-card {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 24px;
		border-radius: 16px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.visual-card:hover {
		transform: translateX(8px);
	}

	.card-primary {
		background: rgba(220, 38, 38, 0.1);
	}

	.card-secondary {
		background: rgba(249, 115, 22, 0.1);
	}

	.card-tertiary {
		background: rgba(236, 72, 153, 0.1);
	}

	.visual-icon {
		font-size: 36px;
	}

	.visual-text {
		font-size: 18px;
		font-weight: 600;
		color: white;
	}

	/* CTA Section */
	.cta-section {
		text-align: center;
		padding: 60px 40px;
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
		border-radius: 24px;
		border: 1px solid rgba(220, 38, 38, 0.1);
	}

	.cta-title {
		font-size: 36px;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 12px;
	}

	.cta-description {
		font-size: 18px;
		color: #64748b;
		margin-bottom: 32px;
	}

	.cta-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 30px rgba(220, 38, 38, 0.4);
	}

	.btn-secondary {
		background: white;
		color: #0f172a;
		border: 2px solid #e2e8f0;
	}

	.btn-secondary:hover {
		border-color: #cbd5e1;
		transform: translateY(-2px);
	}

	/* Responsive */
	@media (max-width: 968px) {
		.section-title {
			font-size: 36px;
		}

		.features-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 24px;
		}

		/* .stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 32px;
		} */

		.mission-content {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.mission-section {
			padding: 40px;
		}

		.timeline-item {
			padding-left: 70px;
		}
	}

	@media (max-width: 640px) {
		.about-section {
			padding: 60px 20px;
		}

		.section-header {
			margin-bottom: 60px;
		}

		.section-title {
			font-size: 32px;
		}

		.section-description {
			font-size: 16px;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		/* .stats-section {
			padding: 40px 24px;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		} */

		.path-title {
			font-size: 28px;
		}

		.timeline-item {
			padding-left: 60px;
		}

		.timeline-marker {
			width: 48px;
			height: 48px;
		}

		.marker-number {
			font-size: 20px;
		}

		.timeline-connector {
			left: 23px;
		}

		.mission-section {
			padding: 32px 24px;
		}

		.mission-title {
			font-size: 24px;
		}

		.cta-section {
			padding: 40px 24px;
		}

		.cta-title {
			font-size: 28px;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}
	}

	/* Footer */
	.footer {
		background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
		color: #cbd5e1;
		padding: 85px 20px 40px;
		bottom: 0;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 1.5fr 2.5fr;
		gap: 60px;
		margin-bottom: 60px;
	}

	.footer-logo {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.logo-text {
		font-size: 32px;
		font-weight: 700;
		color: white;
	}

	.logo-subtext {
		font-size: 20px;
		font-weight: 600;
		color: #dc2626;
	}

	.footer-tagline {
		font-size: 15px;
		line-height: 1.7;
		color: #94a3b8;
		margin-bottom: 24px;
		max-width: 400px;
	}

	.social-links {
		display: flex;
		gap: 12px;
	}

	.social-link {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		color: #cbd5e1;
		transition: all 0.3s ease;
	}

	.social-link:hover {
		background: #dc2626;
		color: white;
		transform: translateY(-2px);
	}

	.footer-links {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 40px;
	}

	.footer-title {
		font-size: 16px;
		font-weight: 600;
		color: white;
		margin-bottom: 20px;
	}

	.footer-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footer-list a {
		color: #94a3b8;
		text-decoration: none;
		font-size: 14px;
		transition: color 0.3s ease;
	}

	.footer-list a:hover {
		color: #dc2626;
	}

	/* .newsletter-text {
		font-size: 14px;
		color: #94a3b8;
		margin-bottom: 16px;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.newsletter-input {
		padding: 12px 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.05);
		color: white;
		font-size: 14px;
		outline: none;
		transition: border-color 0.3s ease;
	} */

	/* .newsletter-input:focus {
		border-color: #dc2626;
	}

	.newsletter-input::placeholder {
		color: #64748b;
	} */

	/* .newsletter-button {
		padding: 12px 16px;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.newsletter-button:hover {
		background: #b91c1c;
	} */

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 40px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.copyright {
		font-size: 14px;
		color: #64748b;
	}

	/* .footer-legal {
		display: flex;
		gap: 24px;
	}

	.footer-legal a {
		color: #94a3b8;
		text-decoration: none;
		font-size: 14px;
		transition: color 0.3s ease;
	}

	.footer-legal a:hover {
		color: #dc2626;
	} */

	/* Responsive */
	@media (max-width: 968px) {
		.nav-links {
			position: fixed;
			top: 0;
			right: -100%;
			width: 280px;
			height: 100vh;
			background: rgba(255, 255, 255, 0.98);
			backdrop-filter: blur(20px);
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
			padding: 100px 40px 40px;
			gap: 24px;
			box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
			transition: right 0.3s ease;
		}

		.nav-links.active {
			right: 0;
		}

		.nav-links a {
			font-size: 18px;
			width: 100%;
			padding: 8px 0;
		}

		.nav-links a::after {
			bottom: 0;
		}

		.nav-btn-mobile {
			display: flex;
			flex-direction: column;
			gap: 12px;
			width: 100%;
			margin-top: 20px;
			padding-top: 20px;
			border-top: 1px solid rgba(226, 232, 240, 0.6);
		}

		.nav-btn-mobile .btn-signup,
		.nav-btn-mobile .btn-signin {
			width: 100%;
			text-align: center;
			justify-content: center;
			display: flex;
			padding: 12px 24px;
		}

		.nav-btn-desktop {
			display: none;
		}

		.mobile-toggle {
			display: flex;
		}

		.hero-content {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.hero-visual {
			height: 400px;
		}

		.hero-title {
			font-size: 48px;
		}

		.footer-top {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.footer-links {
			grid-template-columns: repeat(2, 1fr);
			gap: 32px;
		}
	}

	@media (max-width: 640px) {
		.nav-container {
			padding: 12px 16px;
		}

		.logo-jp {
			font-size: 20px;
		}

		.logo-name {
			font-size: 18px;
		}

		.nav-links {
			width: 100%;
			right: -100%;
			padding: 90px 30px 30px;
		}

		.nav-links.active {
			right: 0;
		}

		.mobile-toggle {
			padding: 4px;
		}

		.mobile-toggle span {
			width: 22px;
		}

		.hero {
			padding: 100px 20px 60px;
		}

		.hero-title {
			font-size: 36px;
		}

		.hero-description {
			font-size: 16px;
		}

		/* .hero-stats {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.stat-divider {
			display: none;
		} */

		.hero-visual {
			height: 300px;
		}

		.floating-card {
			padding: 16px 20px;
		}

		.card-icon {
			width: 50px;
			height: 50px;
			font-size: 24px;
		}

		.footer-links {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 20px;
			text-align: center;
		}
	}

	@media (max-width: 400px) {
		.logo-name {
			display: none;
		}

		.hero-title {
			font-size: 28px;
		}

		.hero-buttons {
			flex-direction: column;
			width: 100%;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
