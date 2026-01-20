<script lang="ts">
	import { authClient } from '$lib/authClient';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let loading = $state(false);
	let showVerificationMessage = $state(false);
	let userEmail = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = '';
		showVerificationMessage = false;

		const { data, error } = await authClient.signUp.email({
			name,
			email,
			password
		});

		if (error) {
			errorMessage = error.message ?? 'An unexpected error occurred';
			loading = false;
		} else {
			// Show verification message instead of redirecting
			userEmail = email;
			showVerificationMessage = true;
			loading = false;

			// Clear form
			name = '';
			email = '';
			password = '';
		}
	}

	function getEmailProvider(email: string): { name: string; url: string } | null {
		const domain = email.split('@')[1]?.toLowerCase();

		const providers: Record<string, { name: string; url: string }> = {
			'gmail.com': { name: 'Gmail', url: 'https://mail.google.com' },
			'yahoo.com': { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' },
			'outlook.com': { name: 'Outlook', url: 'https://outlook.live.com' },
			'hotmail.com': { name: 'Outlook', url: 'https://outlook.live.com' },
			'icloud.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' }
		};

		return providers[domain] || null;
	}

	let emailProvider = $derived(userEmail ? getEmailProvider(userEmail) : null);
</script>

<div class="auth-card">
	<a href="/" class="home-btn">Home</a>

	{#if showVerificationMessage}
		<div class="verification-container">
			<div class="success-icon">✉️</div>
			<h2>Check Your Email</h2>
			<p class="verification-message">
				We've sent a verification link to <strong>{userEmail}</strong>
			</p>
			<p class="verification-instructions">
				Click the link in the email to verify your account and complete the signup process.
			</p>

			{#if emailProvider}
				<a
					href={emailProvider.url}
					target="_blank"
					rel="noopener noreferrer"
					class="open-email-btn"
				>
					Open {emailProvider.name}
				</a>
			{/if}

			<div class="verification-tips">
				<p><strong>Didn't receive the email?</strong></p>
				<ul>
					<li>Check your spam or junk folder</li>
					<li>Make sure you entered the correct email address</li>
					<li>Wait a few minutes and check again</li>
				</ul>
			</div>

			<button
				onclick={() => {
					showVerificationMessage = false;
				}}
				class="back-btn"
			>
				Back to Sign Up
			</button>
		</div>
	{:else}
		<h2>Create Account</h2>

		{#if errorMessage}
			<div class="error-alert">{errorMessage}</div>
		{/if}

		<form onsubmit={handleSubmit}>
			<div class="form-group">
				<label for="name">Full Name</label>
				<input type="text" id="name" bind:value={name} required placeholder="John Doe" />
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" bind:value={email} required placeholder="name@example.com" />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					placeholder="••••••••"
				/>
			</div>

			<button type="submit" disabled={loading}>
				{loading ? 'Creating Account...' : 'Sign Up'}
			</button>
		</form>

		<p class="switch-link">
			Already have an account? <a href="/sign-in">Sign In</a>
		</p>
	{/if}
</div>

<style>
	/* Auth Page Container */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	/* 
	.auth-wrapper {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
		background: linear-gradient(135deg, #fef3f5 0%, #fef9fc 50%, #f0f4ff 100%);
		position: relative;
		overflow: hidden;
	} */

	/* Background Decorations */
	/* .auth-wrapper::before {
		content: '';
		position: absolute;
		width: 400px;
		height: 400px;
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border-radius: 50%;
		filter: blur(80px);
		top: -100px;
		right: -100px;
		pointer-events: none;
	}

	.auth-wrapper::after {
		content: '';
		position: absolute;
		width: 350px;
		height: 350px;
		background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
		border-radius: 50%;
		filter: blur(80px);
		bottom: -100px;
		left: -100px;
		pointer-events: none;
	} */

	/* Auth Card */
	.auth-card {
		margin: 11rem auto;
		width: 100%;
		max-width: 460px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		padding: 48px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.8);
		position: relative;
		z-index: 1;
	}

	/* Home Button */
	.home-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: rgba(220, 38, 38, 0.05);
		color: #dc2626;
		text-decoration: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 24px;
		transition: all 0.3s ease;
	}

	.home-btn:hover {
		background: rgba(220, 38, 38, 0.1);
		transform: translateX(-2px);
	}

	.home-btn::before {
		content: '←';
		font-size: 16px;
	}

	/* Heading */
	.auth-card h2 {
		font-size: 32px;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 8px 0;
		background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Error Alert */
	.error-alert {
		padding: 14px 18px;
		background: #fee2e2;
		border: 1px solid #fecaca;
		border-radius: 12px;
		color: #991b1b;
		font-size: 14px;
		margin: 20px 0;
		display: flex;
		align-items: center;
		gap: 10px;
		animation: slideDown 0.3s ease;
	}

	.error-alert::before {
		content: '⚠';
		font-size: 18px;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Form Styles */
	form {
		margin-top: 32px;
	}

	.form-group {
		margin-bottom: 24px;
	}

	.form-group label {
		display: block;
		font-size: 14px;
		font-weight: 600;
		color: #334155;
		margin-bottom: 8px;
	}

	.form-group input {
		width: 100%;
		padding: 14px 16px;
		font-size: 15px;
		color: #0f172a;
		background: white;
		border: 2px solid #e2e8f0;
		border-radius: 12px;
		outline: none;
		transition: all 0.3s ease;
		font-family: inherit;
	}

	.form-group input::placeholder {
		color: #94a3b8;
	}

	.form-group input:focus {
		border-color: #dc2626;
		box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
	}

	.form-group input:hover:not(:focus) {
		border-color: #cbd5e1;
	}

	/* Submit Button */
	button[type='submit'] {
		width: 100%;
		padding: 16px;
		font-size: 16px;
		font-weight: 600;
		color: white;
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
		margin-top: 8px;
	}

	button[type='submit']:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 30px rgba(220, 38, 38, 0.4);
	}

	button[type='submit']:active:not(:disabled) {
		transform: translateY(0);
	}

	button[type='submit']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	/* Switch Link */
	.switch-link {
		text-align: center;
		margin-top: 24px;
		font-size: 14px;
		color: #64748b;
	}

	.switch-link a {
		color: #dc2626;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		position: relative;
	}

	.switch-link a::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #dc2626, #ec4899);
		transition: width 0.3s ease;
	}

	.switch-link a:hover {
		color: #b91c1c;
	}

	.switch-link a:hover::after {
		width: 100%;
	}

	/* .verification-container {
		text-align: center;
		padding: 1rem 0;
	}

	.success-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: bounce 0.6s ease;
	} */

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	/* .verification-message {
		font-size: 1rem;
		color: #333;
		margin: 1rem 0;
	}

	.verification-message strong {
		color: #0066cc;
	}

	.verification-instructions {
		color: #666;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.open-email-btn {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		margin-bottom: 2rem;
		transition: background 0.3s;
	}

	.open-email-btn:hover {
		background: #0052a3;
	}

	.verification-tips {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		margin: 2rem 0;
		text-align: left;
	}

	.verification-tips p {
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	.verification-tips ul {
		margin: 0.5rem 0 0 1.5rem;
		color: #666;
	}

	.verification-tips li {
		margin: 0.5rem 0;
	}

	.back-btn {
		background: transparent;
		color: #0066cc;
		border: 2px solid #0066cc;
		padding: 0.75rem 2rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s;
	} */

	/* .back-btn:hover {
		background: #0066cc;
		color: white;
	} */

	/* Responsive Design */
	@media (max-width: 640px) {
		.auth-card {
			padding: 32px 24px;
			border-radius: 20px;
		}

		.auth-card h2 {
			font-size: 28px;
		}

		.form-group input {
			padding: 12px 14px;
			font-size: 14px;
		}

		button[type='submit'] {
			padding: 14px;
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		/* .auth-wrapper {
			padding: 20px 16px;
		} */

		.auth-card {
			padding: 28px 20px;
		}

		.auth-card h2 {
			font-size: 24px;
		}
	}

	/* Optional: Add loading spinner */
	button[type='submit']:disabled::after {
		content: '';
		display: inline-block;
		width: 14px;
		height: 14px;
		margin-left: 8px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
