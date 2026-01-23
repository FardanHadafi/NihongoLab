<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
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
				error = 'Image Size Must Be 5MB or Less';
				return;
			}

			// Validate file type
			if (!file.type.startsWith('image/')) {
				error = 'Please Select an Image File';
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
			throw new Error('Image Upload Failed');
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
					throw new Error('Image Upload Failed');
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

			successMessage = 'Your Profile Has Been Updated !';

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
			<p>Loading...</p>
		</div>
	{:else if error && !profile}
		<div class="error-state">
			<div class="error-icon">⚠️</div>
			<h2>An Error Has Occurred</h2>
			<p>{error}</p>
			<button class="retry-btn" onclick={fetchProfile}>Retry</button>
		</div>
	{:else if profile}
		<div class="profile-container">
			<div class="profile-header">
				<h1>Profile Settings</h1>
				<p class="subtitle">Manage Account Information</p>
			</div>

			<div class="profile-grid">
				<!-- Profile Info Card -->
				<div class="profile-card info-card">
					<h2>Account Information</h2>

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
						<label class="info-label">User ID</label>
						<p class="info-value">{profile.id}</p>
					</div>

					<div class="info-item">
						<label class="info-label">Email Address</label>
						<p class="info-value">{profile.email}</p>
					</div>

					<div class="info-item">
						<label class="info-label">Current Level</label>
						<p class="info-value level-badge">{profile.levelName || 'N5'}</p>
					</div>

					{#if profile.requiredExp}
						<div class="progress-section">
							<div class="progress-header">
								<span class="progress-label">Exp Points</span>
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
					<h2>Edit Profile</h2>

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
							<label for="name" class="form-label">Name *</label>
							<input
								type="text"
								id="name"
								class="form-input"
								bind:value={name}
								placeholder="John Doe"
								required
							/>
						</div>

						<div class="form-group">
							<label for="imageUrl" class="form-label">Profile Image URL</label>
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
							<p class="form-help">Enter an Image URL or Upload File Below</p>
						</div>

						<div class="form-group">
							<label for="imageFile" class="form-label">Or Upload an Image</label>
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
									<span>{imageFile ? imageFile.name : 'Select File'}</span>
								</label>
							</div>
							<p class="form-help">JPG, PNG, WEBP (Max 5MB)</p>
						</div>

						<div class="form-actions">
							<button
								type="button"
								class="btn btn-secondary"
								onclick={fetchProfile}
								disabled={saving}
							>
								Reset
							</button>
							<button type="submit" class="btn btn-primary" disabled={saving || uploading}>
								{uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>

			<!-- Quick Links -->
			<div class="quick-links profile-card">
				<h3>Quick Settings</h3>
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
							<p class="link-title">Change Password</p>
							<p class="link-description">Manage and Change Security Settings</p>
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
							<p class="link-title">Dashboard</p>
							<p class="link-description">Check Your Learning Progress</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.profile-page {
		min-height: 100vh;
		background: #f9fafb;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.profile-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.profile-header {
		margin-bottom: 2rem;
	}

	.profile-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		font-size: 1rem;
	}

	.profile-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.profile-card {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.profile-card h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1.5rem;
	}

	.profile-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1rem;
	}

	/* Avatar Section */
	.avatar-section {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.avatar-large {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-placeholder {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 2.5rem;
	}

	/* Info Items */
	.info-item {
		margin-bottom: 1.5rem;
	}

	.info-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.info-value {
		font-size: 1rem;
		color: #1a1a1a;
		margin: 0;
	}

	.level-badge {
		display: inline-block;
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-weight: 600;
	}

	/* Progress Section */
	.progress-section {
		margin-top: 1.5rem;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.progress-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #666;
	}

	.progress-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.progress-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
		border-radius: 4px;
		transition: width 0.3s ease;
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

	.form-input {
		width: 93%;
		padding: 0.75rem 1rem;
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

	.form-help {
		font-size: 0.875rem;
		color: #666;
		margin: 0.5rem 0 0;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
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
	}

	.btn-secondary:hover:not(:disabled) {
		background: #f9fafb;
	}

	/* File Input */
	.file-input-wrapper {
		position: relative;
	}

	.file-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.file-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: 2px dashed #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		background: #f9fafb;
	}

	.file-label:hover {
		border-color: #667eea;
		background: #f3f4f6;
	}

	.file-label svg {
		color: #667eea;
		flex-shrink: 0;
	}

	.file-label span {
		color: #4b5563;
		font-size: 0.9375rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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

	/* Quick Links */
	.quick-links {
		grid-column: 1 / -1;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	.quick-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.quick-link:hover {
		background: #f3f4f6;
		transform: translateY(-2px);
	}

	.quick-link svg {
		color: #667eea;
		flex-shrink: 0;
	}

	.link-title {
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 0.25rem;
	}

	.link-description {
		font-size: 0.875rem;
		color: #666;
		margin: 0;
	}

	/* Loading & Error States */
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		gap: 1.5rem;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #e5e7eb;
		border-top-color: #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-state p {
		font-size: 1.1rem;
		color: #666;
	}

	.error-state {
		text-align: center;
	}

	.error-icon {
		font-size: 4rem;
	}

	.error-state h2 {
		font-size: 1.5rem;
		color: #dc2626;
		margin: 0;
	}

	.error-state p {
		color: #666;
		margin: 0.5rem 0 1.5rem;
	}

	.retry-btn {
		padding: 0.75rem 2rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.retry-btn:hover {
		background: #5568d3;
		transform: translateY(-2px);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.profile-container {
			padding: 1rem;
		}

		.profile-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
