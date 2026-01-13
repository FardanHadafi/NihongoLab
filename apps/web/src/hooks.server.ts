import { redirect, type Handle } from '@sveltejs/kit';
import { authClient } from './lib/authClient';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.') || event.url.pathname.includes('.')) {
		return resolve(event);
	}
	// Check session to Backend
	// We need pass headers cookie from request to authClient
	const { data } = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers
		}
	});

	try {
		// Save user data to locals so that can be accessed from all +page.server
		event.locals.user = data?.user || null;
		event.locals.session = data.session || null;
	} catch (error) {
		console.error('Auth server connection failed:', error);
		event.locals.user = null;
		event.locals.session = null;
	}
	// Protection Routes Logic
	const routeId = event.route.id;

	// Check if this route inside (protected) folder
	const isProtectedRoute = routeId?.startsWith('/(protected)');

	// Check if this route is SignUp/SignIn page (auth) group
	const isAuthRoute = routeId?.startsWith('/(auth)');

	// CASE A: Wanna go (protected) routes but not Signed In
	if (isProtectedRoute && !event.locals.session) {
		throw redirect(303, '/sign-in');
	}

	// CASE B: Want to Sign-In but actually already Signed-In
	if (isAuthRoute && event.locals.session) {
		throw redirect(303, '/dashboard');
	}

	// If safe
	return resolve(event);
};
