import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get cookie from the browser
	const cookieHeader = event.request.headers.get('cookie') || '';

	// Ask Backend if the session is valid
	try {
		const response = await fetch('http://localhost:3000/api/auth/get-session', {
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
