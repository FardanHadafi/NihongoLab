<script lang="ts">
	import { authClient } from '$lib/authClient';
	import '../../../lib/style/formStyle.css';

	let email = $state('');
	let loading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = '';
		successMessage = '';

		const { data, error } = await authClient.requestPasswordReset({
			email,
			redirectTo: '/reset-password' // The page user lands on from the email link
		});

		if (error) {
			errorMessage = error.message || 'Un expected error occurred';
		} else {
			successMessage = "If an account exists, we've sent a password reset link.";
		}

		loading = false;
	}
</script>

<div class="auth-card">
	<h2>Reset Password</h2>

	{#if errorMessage}
		<div class="error-alert">{errorMessage}</div>
	{/if}

	{#if successMessage}
		<div class="success-alert">{successMessage}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="email">Enter your email</label>
			<input type="email" id="email" bind:value={email} required placeholder="name@example.com" />
		</div>

		<button type="submit" disabled={loading}>
			{loading ? 'Sending...' : 'Send Reset Link'}
		</button>
	</form>

	<p class="switch-link">
		<a href="/sign-in">Back to Sign In</a>
	</p>
</div>
