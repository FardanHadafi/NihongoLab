import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Get cookie from the browser
	const cookieHeader = event.request.headers.get('cookie') || '';
	const apiBaseUrl = env.PRIVATE_API_URL || 'http://localhost:3000';

	// Ask Backend if the session is valid
	try {
		const response = await fetch(`${apiBaseUrl}/api/auth/get-session`, {
			headers: {
				cookie: cookieHeader
			}
		});

		if (response.ok) {
			const sessionData = await response.json();
			// Store both user and session in locals
			event.locals.user = sessionData?.user || null;
			event.locals.session = sessionData?.session || null;
		} else {
			event.locals.user = null;
			event.locals.session = null;
		}
	} catch (error) {
		console.error('Auth fetch failed:', error);
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
