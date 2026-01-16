import type { RequestHandler } from '@sveltejs/kit';

export const fallback: RequestHandler = async ({ request, fetch, params }) => {
	const targetUrl = `http://localhost:3000/api/auth/${params.path}`;

	// Forward the request to Hono
	const response = await fetch(targetUrl, {
		method: request.method,
		headers: request.headers,
		body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
		credentials: 'include'
	});

	// Create a new response to send back to the browser
	const newResponse = new Response(response.body, response);

	// CRITICAL ! : Manually copy Set-Cookie headers
	const setCookie = response.headers.get('set-cookie');
	if (setCookie) {
		newResponse.headers.set('set-cookie', setCookie);
	}

	return newResponse;
};
