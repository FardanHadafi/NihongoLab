<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import '../../../lib/style/profile.css';
	import type { UserProfile } from '@nihongolab/db';

	let profile: UserProfile | null = $state(null);
	let loading = $state(true);
	let error = $state('');
	let saving = $state(false);
	let uploading = $state(false);
	let successMessage = $state('');

	// Form state
	let name = $state('');
	let imageUrl = $state('');
	let imageFile: File | null = $state(null);
	let imagePreview = $state('');

	onMount(async () => {
		await fetchProfile();

		if (profile) {
			gsap.from('.profile-card', {
				duration: 0.6,
				y: 30,
				opacity: 0,
				stagger: 0.1,
				ease: 'power3.out'
			});
		}
	});

	async function fetchProfile() {
		try {
			loading = true;
			error = '';

			const response = await fetch('/api/users/me', {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			profile = await response.json();

			// Initialize form with current values
			if (profile) {
				name = profile.name || '';
				imageUrl = profile.image || '';
				imagePreview = profile.image || '';
			}
		} catch (err) {
			console.error('Failed to fetch profile:', err);
			error = err instanceof Error ? err.message : 'Failed to load profile';
		} finally {
			loading = false;
		}
	}

	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				error = '画像サイズは5MB以下である必要があります';
				return;
			}

			// Validate file type
			if (!file.type.startsWith('image/')) {
				error = '画像ファイルを選択してください';
				return;
			}

			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);

			// Clear any existing URL when file is selected
			imageUrl = '';
		}
	}

	async function uploadImage(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('image', file);

		const response = await fetch('/api/users/upload-image', {
			method: 'POST',
			credentials: 'include',
			body: formData
		});

		if (!response.ok) {
			throw new Error('画像のアップロードに失敗しました');
		}

		const data = await response.json();
		return data.imageUrl;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!name.trim()) {
			error = 'Name is required';
			return;
		}

		try {
			saving = true;
			error = '';
			successMessage = '';

			let finalImageUrl = imageUrl.trim() || null;

			// If user selected a file, upload it first
			if (imageFile) {
				uploading = true;
				try {
					finalImageUrl = await uploadImage(imageFile);
				} catch (uploadError) {
					throw new Error('画像のアップロードに失敗しました');
				} finally {
					uploading = false;
				}
			}

			// Update profile with new data
			const updateData = {
				name: name.trim(),
				image: finalImageUrl
			};

			const response = await fetch('/api/users/me', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(updateData)
			});

			if (!response.ok) {
				throw new Error('Failed to update profile');
			}

			const updated = await response.json();
			profile = { ...profile, ...updated };

			// Update preview with the final URL
			if (finalImageUrl) {
				imagePreview = finalImageUrl;
			}

			// Clear file input
			imageFile = null;

			successMessage = 'プロフィールが更新されました！';

			// Clear success message after 3 seconds
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (err) {
			console.error('Failed to update profile:', err);
			error = err instanceof Error ? err.message : 'Failed to update profile';
		} finally {
			saving = false;
		}
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function calculateProgress(): number {
		if (!profile?.requiredExp || !profile?.currentExp) return 0;
		return (profile.currentExp / profile.requiredExp) * 100;
	}
</script>

<div class="profile-page">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>読み込み中...</p>
		</div>
	{:else if error && !profile}
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<h2>エラーが発生しました</h2>
			<p>{error}</p>
			<button class="retry-btn" onclick={fetchProfile}>再試行</button>
		</div>
	{:else if profile}
		<div class="profile-container">
			<div class="profile-header">
				<h1>プロフィール設定</h1>
				<p class="subtitle">アカウント情報を管理</p>
			</div>

			<div class="profile-grid">
				<!-- Profile Info Card -->
				<div class="profile-card info-card">
					<h2>アカウント情報</h2>

					<div class="avatar-section">
						{#if imagePreview}
							<img src={imagePreview} alt={profile.name} class="avatar-large" />
						{:else}
							<div class="avatar-large avatar-placeholder">
								{getInitials(profile.name)}
							</div>
						{/if}
					</div>

					<div class="info-item">
						<label class="info-label">ユーザーID</label>
						<p class="info-value">{profile.id}</p>
					</div>

					<div class="info-item">
						<label class="info-label">メールアドレス</label>
						<p class="info-value">{profile.email}</p>
					</div>

					<div class="info-item">
						<label class="info-label">現在のレベル</label>
						<p class="info-value level-badge">{profile.levelName || 'N5'}</p>
					</div>

					{#if profile.requiredExp}
						<div class="progress-section">
							<div class="progress-header">
								<span class="progress-label">経験値</span>
								<span class="progress-value">{profile.currentExp} / {profile.requiredExp} XP</span>
							</div>
							<div class="progress-bar">
								<div class="progress-fill" style="width: {calculateProgress()}%"></div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Edit Form Card -->
				<div class="profile-card edit-card">
					<h2>プロフィール編集</h2>

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

					{#if error && profile}
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
						<div class="form-group">
							<label for="name" class="form-label">名前 *</label>
							<input
								type="text"
								id="name"
								class="form-input"
								bind:value={name}
								placeholder="山田太郎"
								required
							/>
						</div>

						<div class="form-group">
							<label for="imageUrl" class="form-label">プロフィール画像URL</label>
							<input
								type="url"
								id="imageUrl"
								class="form-input"
								bind:value={imageUrl}
								oninput={() => {
									imagePreview = imageUrl;
									imageFile = null; // Clear file if URL is entered
								}}
								placeholder="https://example.com/avatar.jpg"
								disabled={!!imageFile}
							/>
							<p class="form-help">画像URLを入力するか、下のファイルをアップロードしてください</p>
						</div>

						<div class="form-group">
							<label for="imageFile" class="form-label">または画像をアップロード</label>
							<div class="file-input-wrapper">
								<input
									type="file"
									id="imageFile"
									class="file-input"
									accept="image/jpeg,image/png,image/jpg,image/webp"
									onchange={handleImageChange}
								/>
								<label for="imageFile" class="file-label">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
									<span>{imageFile ? imageFile.name : 'ファイルを選択'}</span>
								</label>
							</div>
							<p class="form-help">JPG, PNG, WEBP (最大5MB)</p>
						</div>

						<div class="form-actions">
							<button
								type="button"
								class="btn btn-secondary"
								onclick={fetchProfile}
								disabled={saving}
							>
								リセット
							</button>
							<button type="submit" class="btn btn-primary" disabled={saving || uploading}>
								{uploading ? 'アップロード中...' : saving ? '保存中...' : '保存する'}
							</button>
						</div>
					</form>
				</div>
			</div>

			<!-- Quick Links -->
			<div class="quick-links profile-card">
				<h3>クイック設定</h3>
				<div class="links-grid">
					<a href="/change-password" class="quick-link">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<div>
							<p class="link-title">パスワード変更</p>
							<p class="link-description">セキュリティ設定を管理</p>
						</div>
					</a>

					<a href="/dashboard" class="quick-link">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="3" width="7" height="7" />
							<rect x="14" y="3" width="7" height="7" />
							<rect x="14" y="14" width="7" height="7" />
							<rect x="3" y="14" width="7" height="7" />
						</svg>
						<div>
							<p class="link-title">ダッシュボード</p>
							<p class="link-description">学習進捗を確認</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>
