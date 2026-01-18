<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import '../../../lib/style/changePassword.css';

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

		if (score <= 1) return { score, label: '弱い', color: '#dc2626' };
		if (score <= 3) return { score, label: '普通', color: '#f59e0b' };
		return { score, label: '強い', color: '#10b981' };
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		error = '';
		successMessage = '';

		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			error = 'すべてのフィールドを入力してください';
			return;
		}

		if (newPassword.length < 8) {
			error = 'パスワードは8文字以上である必要があります';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = '新しいパスワードが一致しません';
			return;
		}

		if (currentPassword === newPassword) {
			error = '新しいパスワードは現在のパスワードと異なる必要があります';
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
				throw new Error(data.message || 'パスワードの変更に失敗しました');
			}

			successMessage = 'パスワードが正常に変更されました！';

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
			error = err instanceof Error ? err.message : 'パスワードの変更に失敗しました';
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
				<span>プロフィールに戻る</span>
			</a>
			<h1>パスワード変更</h1>
			<p class="subtitle">アカウントのセキュリティを強化</p>
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
					<label for="currentPassword" class="form-label">現在のパスワード *</label>
					<div class="password-input-wrapper">
						<input
							type={showCurrentPassword ? 'text' : 'password'}
							id="currentPassword"
							class="form-input"
							bind:value={currentPassword}
							placeholder="現在のパスワードを入力"
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
					<label for="newPassword" class="form-label">新しいパスワード *</label>
					<div class="password-input-wrapper">
						<input
							type={showNewPassword ? 'text' : 'password'}
							id="newPassword"
							class="form-input"
							bind:value={newPassword}
							placeholder="8文字以上の新しいパスワード"
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
						<li class:met={newPassword.length >= 8}>8文字以上</li>
						<li class:met={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)}>
							大文字と小文字を含む
						</li>
						<li class:met={/\d/.test(newPassword)}>数字を含む</li>
						<li class:met={/[^a-zA-Z0-9]/.test(newPassword)}>特殊文字を含む</li>
					</ul>
				</div>

				<!-- Confirm Password -->
				<div class="form-group">
					<label for="confirmPassword" class="form-label">新しいパスワード（確認） *</label>
					<div class="password-input-wrapper">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							class="form-input"
							bind:value={confirmPassword}
							placeholder="もう一度入力してください"
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
						<p class="error-text">パスワードが一致しません</p>
					{/if}
					{#if confirmPassword && newPassword === confirmPassword}
						<p class="success-text">✓ パスワードが一致しています</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<div class="form-actions">
					<a href="/profile" class="btn btn-secondary">キャンセル</a>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={loading ||
							!currentPassword ||
							!newPassword ||
							!confirmPassword ||
							newPassword !== confirmPassword}
					>
						{loading ? '変更中...' : 'パスワードを変更'}
					</button>
				</div>
			</form>

			<!-- Security Tips -->
			<div class="security-tips">
				<h3>🔒 セキュリティのヒント</h3>
				<ul>
					<li>定期的にパスワードを変更しましょう</li>
					<li>他のサイトで使用しているパスワードは使わないでください</li>
					<li>パスワードを他人と共有しないでください</li>
					<li>二段階認証を有効にすることをお勧めします</li>
				</ul>
			</div>
		</div>
	</div>
</div>
