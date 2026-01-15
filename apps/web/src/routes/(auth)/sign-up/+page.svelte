<script lang="ts">
	import { authClient } from '$lib/authClient';
	import '../../../lib/style/formStyle.css';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = ''; // Reset Error

		const { data, error } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: '/sign-in' // Redirect after success
		});

		if (error) {
			// Better-Auth returns an error object with a message
			errorMessage = error.message ?? 'An unexpected error occurred';
		} else {
			// Success is usually handled by the callbackURL
		}
		loading = false;
	}
</script>

<div class="auth-card">
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
			<input type="password" id="password" bind:value={password} required placeholder="••••••••" />
		</div>

		<button type="submit" disabled={loading}>
			{loading ? 'Creating Account...' : 'Sign Up'}
		</button>
	</form>

	<p class="switch-link">
		Already have an account? <a href="/sign-in">Sign In</a>
	</p>
</div>
