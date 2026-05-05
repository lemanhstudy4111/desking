import * as z from "zod";

export const verifyJWTSchema = z.object({
	token: z.jwt(),
});
