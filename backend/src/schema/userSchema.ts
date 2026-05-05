import * as z from "zod";

export const createUserSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8)
		.regex(/^[a-zA-Z0-9]+$/),
	firstname: z.string().regex(/^[a-zA-Z]+$/),
	lastname: z
		.string()
		.regex(/^[a-zA-Z]+$/)
		.optional(),
});

export const signInUserSchema = z.object({
	email: z.email(),
});
