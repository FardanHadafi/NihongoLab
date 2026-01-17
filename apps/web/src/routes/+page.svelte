<script lang="ts">
	import "../lib/style/homepage.css"
	import {goto} from "$app/navigation";
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
			description: 'From beginner to advanced, master all aspects of Japanese including hiragana, katakana, kanji, grammar, and conversation.'
		},
		{
			icon: '🎯',
			title: 'Interactive Learning',
			description: 'Engage with interactive exercises, quizzes, and real-time feedback to accelerate your learning journey.'
		},
		{
			icon: '🌸',
			title: 'Cultural Immersion',
			description: 'Dive deep into Japanese culture, traditions, and customs while learning the language authentically.'
		},
	];

	// const stats = [
	// 	{ number: '2,000+', label: 'Kanji Lessons' },
	// 	{ number: '500+', label: 'Grammar Points' },
	// ];

	const timeline = [
		{
			level: 'Beginner',
			title: 'Foundation',
			description: 'Master hiragana and katakana, learn basic grammar, and start simple conversations.',
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
				<div class="badge">
					<span class="badge-icon">✨</span>
					<span>Master Japanese with Confidence</span>
				</div>

				<h1 class="hero-title">
					Learn Japanese
					<span class="gradient-text">Naturally</span>
				</h1>

				<p class="hero-description">
					Master hiragana, katakana, and kanji through interactive lessons,
					real conversations, and cultural insights. Your journey to fluency starts here.
				</p>

				<div class="hero-buttons">
					<button class="btn btn-primary" onclick={() => goto("/sign-up")}>
						Start Learning Free
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
				<div class="badge">
					<span class="badge-icon">🎓</span>
					<span>About NihongoLab</span>
				</div>
				<h2 class="section-title">
					Your Journey to
					<span class="gradient-text">Japanese Fluency</span>
				</h2>
				<p class="section-description">
					NihongoLab is more than just a learning platform—it's your companion on the path to mastering Japanese.
					We combine cutting-edge technology with proven teaching methods to make learning Japanese accessible,
					engaging, and effective for everyone.
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
										<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
										<path d="M8 4V8L11 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
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
							We believe that learning Japanese should be accessible to everyone, regardless of their background or
							learning style. Our mission is to break down language barriers and foster cultural understanding through
							innovative, personalized learning experiences.
						</p>
						<p class="mission-description">
							Every lesson is crafted with care by experienced educators and native speakers, ensuring you learn
							authentic Japanese that you can use in real-world situations.
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
				<p class="cta-description">Join thousands of students already learning Japanese with NihongoLab</p>
				<div class="cta-buttons">
					<button class="btn btn-primary" onclick={goto("/sign-up")}>
						Start Learning Free
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="btn btn-secondary" onclick={goto("/curriculum")}>View Curriculum</button>
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
						Your trusted companion for mastering the Japanese language through
						innovative learning methods and cultural immersion.
					</p>
					<div class="social-links">
						<a href="https://discord.com/users/305967766031171585" class="social-link" aria-label="Discord" target="_blank" rel="noopener norefferrer">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
							</svg>
						</a>
						<a href="https://github.com/FardanHadafi" class="social-link" aria-label="Github" target="_blank" rel="noopener noreferrer">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>/>
							</svg>
						</a>
					</div>
				</div>

				<div class="footer-links">
					<div class="footer-column">
						<h3 class="footer-title">Learn</h3>
						<ul class="footer-list">
							<li><a href="#">Hiragana</a></li>
							<li><a href="#">Katakana</a></li>
							<li><a href="#">Kanji</a></li>
							<li><a href="#">Grammar</a></li>
							<li><a href="#">Vocabulary</a></li>
						</ul>
					</div>

					<div class="footer-column">
						<h3 class="footer-title">Resources</h3>
						<ul class="footer-list">
							<li><a href="#">Study Guides</a></li>
							<li><a href="#">Practice Tests</a></li>
							<li><a href="#">Audio Lessons</a></li>
							<li><a href="#">Culture Blog</a></li>
							<li><a href="#">Community</a></li>
						</ul>
					</div>

					<div class="footer-column">
						<h3 class="footer-title">Company</h3>
						<ul class="footer-list">
							<li><a href="#">About Us</a></li>
							<li><a href="#">Careers</a></li>
							<li><a href="#">Press Kit</a></li>
							<li><a href="#">Contact</a></li>
							<li><a href="#">Support</a></li>
						</ul>
					</div>

					<div class="footer-column">
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
							<button type="submit" class="newsletter-button">
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>

			<div class="footer-bottom">
				<p class="copyright">© 2026 NihongoLab. All rights reserved.</p>
				<div class="footer-legal">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
					<a href="#">Cookie Policy</a>
				</div>
			</div>
		</div>
	</footer>
</div>