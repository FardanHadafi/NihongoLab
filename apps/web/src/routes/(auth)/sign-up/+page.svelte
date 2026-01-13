<script lang="ts">
	import { authClient } from '$lib/authClient';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	const handleSignUp = async () => {
		loading = true;
		errorMessage = '';

		const { data, error } = await authClient.signUp.email({
			email,
			password,
			name,
			callbackUrl: '/verify-email' // Redirect to
		});

		loading = false;

		if (error) {
			errorMessage = error.message;
		} else {
			// Success, Better-Auth will automatically redirected
			goto('/verify-email');
		}
	};
</script>
