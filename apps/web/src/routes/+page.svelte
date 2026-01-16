<script lang="ts">
	import "../lib/style/homepage.css"
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
				<a href="#home" on:click={toggleMobileMenu}>Home</a>
				<a href="#about" on:click={toggleMobileMenu}>About</a>
				<a href="#contact" on:click={toggleMobileMenu}>Contact</a>

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
					on:click={toggleMobileMenu}
					aria-label="Toggle menu"
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="hero">
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
					<button class="btn btn-primary">
						Start Learning Free
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="btn btn-secondary">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M10 18.75C14.8325 18.75 18.75 14.8325 18.75 10C18.75 5.16751 14.8325 1.25 10 1.25C5.16751 1.25 1.25 5.16751 1.25 10C1.25 14.8325 5.16751 18.75 10 18.75Z" stroke="currentColor" stroke-width="1.5"/>
							<path d="M8.125 6.875L12.5 10L8.125 13.125V6.875Z" fill="currentColor"/>
						</svg>
						Watch Demo
					</button>
				</div>

				<div class="hero-stats">
					<div class="stat">
						<div class="stat-number">50K+</div>
						<div class="stat-label">Active Learners</div>
					</div>
					<div class="stat-divider"></div>
					<div class="stat">
						<div class="stat-number">2,000+</div>
						<div class="stat-label">Kanji Characters</div>
					</div>
					<div class="stat-divider"></div>
					<div class="stat">
						<div class="stat-number">4.9★</div>
						<div class="stat-label">User Rating</div>
					</div>
				</div>
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

	<!-- Footer -->
	<footer class="footer">
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
						<a href="#" class="social-link" aria-label="Twitter">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</a>
						<a href="#" class="social-link" aria-label="YouTube">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
						<a href="#" class="social-link" aria-label="Discord">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
							</svg>
						</a>
						<a href="#" class="social-link" aria-label="Instagram">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072C2.695.272.273 2.69.073 7.052C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881z"/>
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
						<form class="newsletter-form" on:submit={handleNewsletterSubmit}>
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