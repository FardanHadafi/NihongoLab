<script lang="ts">
	import { authClient } from '$lib/authClient';
	import '../../../lib/style/formStyle.css';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		errorMessage = '';

		const { data, error } = await authClient.signIn.email({
			email,
			password,
			callbackURL: '/dashboard' // Redirect after success
		});

		if (error) {
			errorMessage = error.message || 'Un expected error occurred';
		}

		loading = false;
	}
</script>

<div class="auth-card">
	<a href="/" class="home-btn">Home</a>
	<h2>Welcome Back</h2>

	{#if errorMessage}
		<div class="error-alert">{errorMessage}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" id="email" bind:value={email} required placeholder="name@example.com" />
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={password} required placeholder="••••••••" />
		</div>

		<button type="submit" disabled={loading}>
			{loading ? 'Signing In...' : 'Sign In'}
		</button>
	</form>

	<p class="switch-link">
		Don't have an account? <a href="/sign-up">Sign Up</a>
	</p>
</div>
