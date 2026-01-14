import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('better-auth.session_token');

	// Protected Routes
	const protectedRoutes = ['/dashboard', '/profie'];
	const isProtectedRoutes = protectedRoutes.some((route) => {
		event.url.pathname.startsWith(route);
	});

	if (isProtectedRoutes && !sessionToken) {
		throw redirect(303, '/sign-in');
	}

	// Verify session if token exist
	if (sessionToken) {
		try {
			const response = await fetch('http://localhost:3000/api/auth/get-session', {
				headers: {
					Cookie: `better-auth.session_token=${sessionToken}`
				}
			});

			if (response.ok) {
				const session = await response.json();
				event.locals.user = session.user;
			} else if (isProtectedRoutes) {
				throw redirect(303, '/sign-in');
			}
		} catch (error) {
			if (isProtectedRoutes) {
				throw redirect(303, '/sign-in');
			}
		}
	}

	return resolve(event);
};
