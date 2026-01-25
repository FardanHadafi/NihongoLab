import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const HONO_API_URL = env.PRIVATE_API_URL || 'http://localhost:3000';

export const fallback: RequestHandler = async ({ request, fetch, params }) => {
	const url = new URL(request.url);
	const targetUrl = `${HONO_API_URL}/api/auth/${params.path}${url.search}`;

	// Clone headers and remove host
	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('connection');

	// Get body as text for POST requests to avoid duplex issues
	let body: string | null = null;
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		body = await request.text();
	}

	// Forward the request to Hono
	const response = await fetch(targetUrl, {
		method: request.method,
		headers: request.headers,
		body,
		credentials: 'include'
	});

	// Get response body and headers
	const responseBody = await response.arrayBuffer();
	const responseHeaders = new Headers(response.headers);

	// Create new response
	return new Response(responseBody, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
};
