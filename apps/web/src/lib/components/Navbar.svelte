<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { signOut } from '$lib/authClient'; // Import Better-Auth signOut
	import type { User } from '../../../../../packages/db/src/db.types';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	let user: User = {
		name: 'Loading...',
		email: '',
		image: null
	};

	let showProfileMenu = false;
	let showMobileMenu = false;
	let isLoggingOut = false;

	onMount(async () => {
		await fetchUserProfile();

		// Animate navbar on load
		requestAnimationFrame(() => {
			gsap.from('.navbar', {
				y: -100,
				opacity: 0,
				clearProps: 'transform'
			});
		});
	});

	async function fetchUserProfile() {
		try {
			const response = await fetch('/api/users/me', {
				credentials: 'include'
			});

			if (response.ok) {
				const profile = await response.json();
				user = {
					name: profile.name || 'User',
					email: profile.email || '',
					image: profile.image
				};
			}
		} catch (error) {
			console.error('Failed to fetch user profile:', error);
		}
	}

	function toggleProfileMenu() {
		showProfileMenu = !showProfileMenu;
	}

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	function closeMenus() {
		showProfileMenu = false;
		showMobileMenu = false;
	}

	async function handleLogout() {
		if (isLoggingOut) return;

		try {
			isLoggingOut = true;

			// Use Better-Auth's built-in signOut method
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						goto('/sign-in');
					},
					onError: (ctx) => {
						console.error('Logout error:', ctx.error);
						// Still redirect on error
						goto('/sign-in');
					}
				}
			});
		} catch (error) {
			console.error('Logout failed:', error);
			// Force redirect even on error
			redirect(302, 'sign-in');
		} finally {
			isLoggingOut = false;
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

	// Close menus when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
			showProfileMenu = false;
		}
		if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
			showMobileMenu = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<nav class="navbar">
	<div class="navbar-container">
		<!-- Logo -->
		<a href="/dashboard" class="logo" onclick={closeMenus}>
			<span class="logo-jp">日本語</span>
			<span class="logo-name">NihongoLab</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="nav-links">
			<a href="/learn/hiragana" class="nav-link">
				<span class="nav-icon">あ</span>
				<span>Hiragana</span>
			</a>
			<a href="/learn/katakana" class="nav-link">
				<span class="nav-icon">ア</span>
				<span>Katakana</span>
			</a>
			<a href="/learn/kanji" class="nav-link">
				<span class="nav-icon">漢</span>
				<span>Kanji</span>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button class="mobile-menu-button" onclick={toggleMobileMenu} aria-label="Menu">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				{#if showMobileMenu}
					<path d="M18 6L6 18M6 6l12 12" />
				{:else}
					<path d="M3 12h18M3 6h18M3 18h18" />
				{/if}
			</svg>
		</button>

		<!-- User Profile -->
		<div class="profile-section">
			<button class="profile-button" onclick={toggleProfileMenu} aria-label="User menu">
				{#if user.image}
					<img src={user.image} alt={user.name} class="profile-image" />
				{:else}
					<div class="profile-avatar">{getInitials(user.name)}</div>
				{/if}
				<svg
					class="chevron"
					class:rotated={showProfileMenu}
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="currentColor"
				>
					<path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</button>

			<!-- Profile Dropdown -->
			{#if showProfileMenu}
				<div class="profile-dropdown">
					<div class="profile-header">
						{#if user.image}
							<img src={user.image} alt={user.name} class="dropdown-image" />
						{:else}
							<div class="dropdown-avatar">{getInitials(user.name)}</div>
						{/if}
						<div class="profile-info">
							<p class="profile-name">{user.name}</p>
							<p class="profile-email">{user.email}</p>
						</div>
					</div>

					<div class="dropdown-divider"></div>

					<a href="/profile" class="dropdown-item" onclick={closeMenus}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
						<span>Profile</span>
					</a>

					<a href="/change-password" class="dropdown-item" onclick={closeMenus}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<span>Change Password</span>
					</a>

					<div class="dropdown-divider"></div>

					<button class="dropdown-item logout" onclick={handleLogout} disabled={isLoggingOut}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
						<span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="mobile-menu">
			<a href="/learn/hiragana" class="mobile-link" onclick={closeMenus}>
				<span class="nav-icon">あ</span>
				<span>Hiragana</span>
			</a>
			<a href="/learn/katakana" class="mobile-link" onclick={closeMenus}>
				<span class="nav-icon">ア</span>
				<span>Katakana</span>
			</a>
			<a href="/learn/kanji" class="mobile-link" onclick={closeMenus}>
				<span class="nav-icon">漢</span>
				<span>Kanji</span>
			</a>
		</div>
	{/if}
</nav>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.navbar {
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		will-change: transform;
	}

	.navbar-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
		height: 70px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.5rem;
		color: #1a1a1a;
		/* transition: transform 0.2s; */
	}

	/* .logo:hover {
	transform: scale(1.05);
} */

	.logo-jp {
		font-size: 24px;
		color: #0f172a;
	}

	.logo-name {
		font-size: 20px;
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Navigation Links */
	.nav-links {
		display: flex;
		gap: 32px;
		align-items: center;
		transition: all 0.3s ease;
	}

	.nav-links a {
		color: #475569;
		text-decoration: none;
		font-size: 15px;
		font-weight: 500;
		transition: color 0.3s ease;
		position: relative;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #dc2626, #ec4899);
		transition: width 0.3s ease;
	}

	.nav-links a:hover {
		color: #dc2626;
	}

	.nav-links a:hover::after {
		width: 100%;
	}

	.nav-icon {
		font-size: 1.25rem;
		font-weight: 600;
	}

	/* Mobile Menu Button */
	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: #4b5563;
		transition: color 0.2s;
	}

	.mobile-menu-button:hover {
		color: #dc2626;
	}

	/* Profile Section */
	.profile-section {
		position: relative;
	}

	.profile-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: 2px solid #e5e7eb;
		border-radius: 50px;
		padding: 0.25rem 0.75rem 0.25rem 0.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.profile-button:hover {
		color: #dc2626;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
	}

	.profile-image,
	.profile-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
	}

	.profile-avatar {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.chevron {
		transition: transform 0.2s;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	/* Profile Dropdown */
	.profile-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		min-width: 280px;
		padding: 0.75rem;
		animation: slideDown 0.2s ease-out;
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

	.profile-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
	}

	.dropdown-image,
	.dropdown-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.dropdown-avatar {
		background: linear-gradient(135deg, #dc2626 0%, #f97316 50%, #ec4899 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 1.125rem;
	}

	.profile-info {
		flex: 1;
		min-width: 0;
	}

	.profile-name {
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.profile-email {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dropdown-divider {
		height: 1px;
		background: #e5e7eb;
		margin: 0.5rem 0;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		width: 100%;
		text-decoration: none;
		color: #4b5563;
		border-radius: 8px;
		transition: all 0.2s;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.9375rem;
		font-family: inherit;
		text-align: left;
	}

	.dropdown-item:hover {
		background: #f3f4f6;
		color: #1a1a1a;
	}

	.dropdown-item.logout {
		color: #dc2626;
	}

	.dropdown-item.logout:hover {
		background: #fee2e2;
		color: #dc2626;
	}

	.dropdown-item:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Mobile Menu */
	.mobile-menu {
		display: none;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem 2rem;
		border-top: 1px solid #e5e7eb;
		animation: slideDown 0.2s ease-out;
	}

	.mobile-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		text-decoration: none;
		color: #4b5563;
		font-weight: 500;
		border-radius: 8px;
		transition: all 0.2s;
	}

	.mobile-link:hover {
		background: #f3f4f6;
		color: #667eea;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.navbar-container {
			padding: 0 1rem;
			height: 60px;
		}

		.nav-links {
			display: none;
		}

		.mobile-menu-button {
			display: block;
		}

		.mobile-menu {
			display: flex;
		}

		/* .logo-text {
			display: none;
		} */

		.profile-dropdown {
			right: -1rem;
		}
	}

	@media (min-width: 769px) {
		.mobile-menu {
			display: none !important;
		}
	}
</style>
