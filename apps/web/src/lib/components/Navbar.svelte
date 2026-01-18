<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { signOut } from '$lib/authClient'; // Import Better-Auth signOut
	import type { User } from '../../../../../packages/db/src/db.types';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import '../style/navbar.css';

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
		gsap.from('.navbar', {
			duration: 0.6,
			y: -100,
			opacity: 0,
			ease: 'power3.out'
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
			<span class="logo-icon">🇯🇵</span>
			<span class="logo-text">NihongoLab</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="nav-links">
			<a href="/learn/hiragana" class="nav-link">
				<span class="nav-icon">あ</span>
				<span>ひらがな</span>
			</a>
			<a href="/learn/katakana" class="nav-link">
				<span class="nav-icon">ア</span>
				<span>カタカナ</span>
			</a>
			<a href="/learn/kanji" class="nav-link">
				<span class="nav-icon">漢</span>
				<span>漢字</span>
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
						<span>プロフィール</span>
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
						<span>パスワード変更</span>
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
						<span>{isLoggingOut ? 'ログアウト中...' : 'ログアウト'}</span>
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
				<span>ひらがな</span>
			</a>
			<a href="/learn/katakana" class="mobile-link" onclick={closeMenus}>
				<span class="nav-icon">ア</span>
				<span>カタカナ</span>
			</a>
			<a href="/learn/kanji" class="mobile-link" onclick={closeMenus}>
				<span class="nav-icon">漢</span>
				<span>漢字</span>
			</a>
		</div>
	{/if}
</nav>
