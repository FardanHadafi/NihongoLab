// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="vite/client" />

import type { Session, User } from 'better-auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
