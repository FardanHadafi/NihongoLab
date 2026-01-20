<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let loading = $state(false);
	let error = $state('');
	let successMessage = $state('');

	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);

	// Password strength - using $derived for reactive computation
	let passwordStrength = $derived(
		newPassword ? calculatePasswordStrength(newPassword) : { score: 0, label: '', color: '' }
	);

	onMount(() => {
		gsap.from('.password-card', {
			duration: 0.6,
			y: 30,
			opacity: 0,
			ease: 'power3.out'
		});
	});

	function calculatePasswordStrength(password: string) {
		let score = 0;

		if (password.length >= 8) score++;
		if (password.length >= 12) score++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[^a-zA-Z0-9]/.test(password)) score++;

		if (score <= 1) return { score, label: 'Weak', color: '#dc2626' };
		if (score <= 3) return { score, label: 'Moderate', color: '#f59e0b' };
		return { score, label: 'Strong', color: '#10b981' };
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		error = '';
		successMessage = '';

		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			error = 'Please Fill in All Fields';
			return;
		}

		if (newPassword.length < 8) {
			error = 'Password Must Be At Least 8 Characters';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = 'New Password Doesn"t Match';
			return;
		}

		if (currentPassword === newPassword) {
			error = 'The New Password Must Be Different From The Current Password';
			return;
		}

		try {
			loading = true;

			// Better-Auth change password endpoint
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Password Change Failed');
			}

			successMessage = 'Your Password Has Been Changed !';

			// Clear form
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';

			// Clear success message after 5 seconds
			setTimeout(() => {
				successMessage = '';
			}, 5000);
		} catch (err) {
			console.error('Password change failed:', err);
			error = err instanceof Error ? err.message : 'Password Change Failed';
		} finally {
			loading = false;
		}
	}

	function togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
		if (field === 'current') showCurrentPassword = !showCurrentPassword;
		if (field === 'new') showNewPassword = !showNewPassword;
		if (field === 'confirm') showConfirmPassword = !showConfirmPassword;
	}
</script>

<div class="password-page">
	<div class="password-container">
		<div class="password-header">
			<a href="/profile" class="back-link">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				<span>Return To Profile</span>
			</a>
			<h1>Change Password</h1>
			<p class="subtitle">Increase Your Account Security</p>
		</div>

		<div class="password-card">
			{#if successMessage}
				<div class="success-message">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
					<span>{successMessage}</span>
				</div>
			{/if}

			{#if error}
				<div class="error-message">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<span>{error}</span>
				</div>
			{/if}

			<form onsubmit={handleSubmit}>
				<!-- Current Password -->
				<div class="form-group">
					<label for="currentPassword" class="form-label">Current Password *</label>
					<div class="password-input-wrapper">
						<input
							type={showCurrentPassword ? 'text' : 'password'}
							id="currentPassword"
							class="form-input"
							bind:value={currentPassword}
							placeholder="Enter Current Password"
							required
						/>
						<button
							type="button"
							class="toggle-password"
							onclick={() => togglePasswordVisibility('current')}
							aria-label="Toggle password visibility"
						>
							{#if showCurrentPassword}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									/>
									<line x1="1" y1="1" x2="23" y2="23" />
								</svg>
							{:else}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- New Password -->
				<div class="form-group">
					<label for="newPassword" class="form-label">New Password *</label>
					<div class="password-input-wrapper">
						<input
							type={showNewPassword ? 'text' : 'password'}
							id="newPassword"
							class="form-input"
							bind:value={newPassword}
							placeholder="New Password At Least 8 Characters"
							required
						/>
						<button
							type="button"
							class="toggle-password"
							onclick={() => togglePasswordVisibility('new')}
							aria-label="Toggle password visibility"
						>
							{#if showNewPassword}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									/>
									<line x1="1" y1="1" x2="23" y2="23" />
								</svg>
							{:else}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>

					<!-- Password Strength Indicator -->
					{#if newPassword}
						<div class="password-strength">
							<div class="strength-bars">
								<div
									class="strength-bar"
									class:active={passwordStrength.score >= 1}
									style="background-color: {passwordStrength.score >= 1
										? passwordStrength.color
										: '#e5e7eb'}"
								></div>
								<div
									class="strength-bar"
									class:active={passwordStrength.score >= 2}
									style="background-color: {passwordStrength.score >= 2
										? passwordStrength.color
										: '#e5e7eb'}"
								></div>
								<div
									class="strength-bar"
									class:active={passwordStrength.score >= 3}
									style="background-color: {passwordStrength.score >= 3
										? passwordStrength.color
										: '#e5e7eb'}"
								></div>
								<div
									class="strength-bar"
									class:active={passwordStrength.score >= 4}
									style="background-color: {passwordStrength.score >= 4
										? passwordStrength.color
										: '#e5e7eb'}"
								></div>
								<div
									class="strength-bar"
									class:active={passwordStrength.score >= 5}
									style="background-color: {passwordStrength.score >= 5
										? passwordStrength.color
										: '#e5e7eb'}"
								></div>
							</div>
							<span class="strength-label" style="color: {passwordStrength.color}">
								{passwordStrength.label}
							</span>
						</div>
					{/if}

					<ul class="password-requirements">
						<li class:met={newPassword.length >= 8}>8 Characters or More</li>
						<li class:met={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)}>
							Contains Uppercase and Lowercase Letters
						</li>
						<li class:met={/\d/.test(newPassword)}>Contains Numbers</li>
						<li class:met={/[^a-zA-Z0-9]/.test(newPassword)}>Contains Special Characters</li>
					</ul>
				</div>

				<!-- Confirm Password -->
				<div class="form-group">
					<label for="confirmPassword" class="form-label">New Password (Confirm) *</label>
					<div class="password-input-wrapper">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							class="form-input"
							bind:value={confirmPassword}
							placeholder="Type it Again"
							required
						/>
						<button
							type="button"
							class="toggle-password"
							onclick={() => togglePasswordVisibility('confirm')}
							aria-label="Toggle password visibility"
						>
							{#if showConfirmPassword}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									/>
									<line x1="1" y1="1" x2="23" y2="23" />
								</svg>
							{:else}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>
					{#if confirmPassword && newPassword !== confirmPassword}
						<p class="error-text">Passowrd Doesn't Match</p>
					{/if}
					{#if confirmPassword && newPassword === confirmPassword}
						<p class="success-text">✓ Password Match</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<div class="form-actions">
					<a href="/profile" class="btn btn-secondary">Cancel</a>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={loading ||
							!currentPassword ||
							!newPassword ||
							!confirmPassword ||
							newPassword !== confirmPassword}
					>
						{loading ? 'Changing...' : 'Change Password'}
					</button>
				</div>
			</form>

			<!-- Security Tips -->
			<div class="security-tips">
				<h3>Security Tips</h3>
				<ul>
					<li>Change Your Password Regularly</li>
					<li>Don't Use Passwords You Use On Other Sites</li>
					<li>Don't Share Your Password With Anyone</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.password-page {
		min-height: 100vh;
		background: #f9fafb;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		padding: 2rem;
	}

	.password-container {
		max-width: 600px;
		margin: 0 auto;
	}

	.password-header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		margin-bottom: 1rem;
		transition: all 0.2s;
	}

	.back-link:hover {
		gap: 0.75rem;
	}

	.password-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		font-size: 1rem;
	}

	.password-card {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	/* Form */
	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.password-input-wrapper {
		position: relative;
	}

	.form-input {
		width: 87%;
		padding: 0.75rem 3rem 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.toggle-password {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #9ca3af;
		padding: 0.5rem;
		transition: color 0.2s;
	}

	.toggle-password:hover {
		color: #667eea;
	}

	/* Password Strength */
	.password-strength {
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.strength-bars {
		flex: 1;
		display: flex;
		gap: 0.25rem;
	}

	.strength-bar {
		flex: 1;
		height: 4px;
		background: #e5e7eb;
		border-radius: 2px;
		transition: all 0.3s;
	}

	.strength-label {
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Password Requirements */
	.password-requirements {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
	}

	.password-requirements li {
		font-size: 0.875rem;
		color: #9ca3af;
		padding: 0.25rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.password-requirements li::before {
		content: '○';
		position: absolute;
		left: 0;
	}

	.password-requirements li.met {
		color: #10b981;
	}

	.password-requirements li.met::before {
		content: '✓';
	}

	.error-text,
	.success-text {
		font-size: 0.875rem;
		margin: 0.5rem 0 0;
	}

	.error-text {
		color: #dc2626;
	}

	.success-text {
		color: #10b981;
	}

	/* Messages */
	.success-message,
	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.success-message {
		background: #d1fae5;
		color: #065f46;
	}

	.error-message {
		background: #fee2e2;
		color: #991b1b;
	}

	/* Form Actions */
	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		flex: 1;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		text-decoration: none;
		text-align: center;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.btn-secondary {
		background: white;
		color: #4b5563;
		border: 2px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-secondary:hover {
		background: #f9fafb;
	}

	/* Security Tips */
	.security-tips {
		margin-top: 2rem;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 12px;
	}

	.security-tips h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1rem;
	}

	.security-tips ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.security-tips li {
		font-size: 0.875rem;
		color: #666;
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.security-tips li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: #667eea;
		font-weight: bold;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.password-page {
			padding: 1rem;
		}

		.form-actions {
			flex-direction: column;
		}
	}
</style>
