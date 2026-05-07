import * as z from "zod";

export const verifyJWTSchema = z.object({
	token: z.jwt(),
});

export const signInUserPasswordSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8)
		.regex(/^[a-zA-Z0-9]+$/),
});

export const signInUserOTPSchema = z.object({
	email: z.email(),
});

export const verifyOTPSchema = z.object({
	email: z.email(),
	token: z
		.string()
		.min(6)
		.max(6)
		.regex(/^[0-9]+$/),
});
