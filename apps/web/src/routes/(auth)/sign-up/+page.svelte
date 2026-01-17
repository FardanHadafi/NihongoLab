<script lang="ts">
	import { authClient } from '$lib/authClient';
	import '../../../lib/style/formStyle.css';

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
			password,
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
			'icloud.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' },
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
				<a href={emailProvider.url} target="_blank" rel="noopener noreferrer" class="open-email-btn">
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

			<button onclick={() => { showVerificationMessage = false; }} class="back-btn">
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