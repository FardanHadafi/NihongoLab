import { fail } from '@sveltejs/kit';
import type {Actions} from "./$types"

export const actions = {
	signup: async ({request, fetch, cookies}) => {
		const data = await request.formData();
		const name = data.get("name");
		const email = data.get("email");
		const password = data.get("password");

		try {
			const response = await fetch("http://localhost:3000/api/auth/sign-up/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					email,
					password
				}),
				credentials: "include" // Include cookie
			});

			if (!response.ok) {
				const error = await response.json();
				return fail(400, {
					error: error.message || "Sign up failed",
					email: email?.toString()
				});
			}

			const result = await response.json();
			// Forward any cookies from Better-Auth to the client
			const setCookieHeader = response.headers.get("set-cookie");
			if (setCookieHeader) {
				// Better-Auth typically sets its own cookies
				// SvelteKit will forward them automatically
			}

			return {success: true, data: result}
		} catch (error) {
			console.error("Sign up error:", error);
			return fail(500, {
				error: "Network error. Please try again.",
				email: email?.toString()
			})
		}
	}
} satisfies Actions