import type { RequestHandler } from '@sveltejs/kit';

const HONO_API_URL = 'http://localhost:3000';

const handler: RequestHandler = async ({ request, params }) => {
	console.log('🔥 API PROXY HIT:', params.path);

	const url = new URL(request.url);
	const targetUrl = `${HONO_API_URL}/api/${params.path}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('connection');

	let body: string | undefined;
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		body = await request.text();
	}

	const res = await fetch(targetUrl, {
		method: request.method,
		headers,
		body,
		credentials: 'include'
	});

	return new Response(await res.arrayBuffer(), {
		status: res.status,
		headers: res.headers
	});
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
