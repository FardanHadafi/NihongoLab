import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const HONO_API_URL = env.PRIVATE_API_URL || 'http://localhost:3000';

const handler: RequestHandler = async ({ request, params }) => {
	console.log('API PROXY HIT:', params.path);

	const url = new URL(request.url);
	const targetUrl = `${HONO_API_URL}/api/${params.path}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('connection');

	const res = await fetch(targetUrl, {
		method: request.method,
		headers,
		body: request.body,
		credentials: 'include',
		duplex: 'half'
	} as RequestInit);

	return new Response(res.body, {
		status: res.status,
		headers: res.headers
	});
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
