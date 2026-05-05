import * as z from "zod";

export const verifyJWTSchema = z.object({
	token: z.jwt(),
});

export const signInUserSchema = z.object({
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
