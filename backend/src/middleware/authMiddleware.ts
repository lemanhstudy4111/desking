import dotenv from "dotenv";
import { verifyJWTSchema } from "../schema/authSchema.js";
import { returnOpFailed, returnValidationError } from "../error.js";
import { supabase } from "../controllers/auth.js";
import type { NextFunction, Request, Response } from "express";
dotenv.config();

dotenv.config();
interface JwtClaims {
	iss: string;
	aud: string | string[];
	exp: number;
	iat: number;
	sub: string;
	role: string;
	aal: "aal1" | "aal2";
	session_id: string;
	email: string;
	phone: string;
	is_anonymous: boolean;
	jti?: string;
	nbf?: number;
	app_metadata?: Record<string, any>;
	user_metadata?: Record<string, any>;
	amr?: Array<{
		method: string;
		timestamp: number;
	}>;
	ref?: string; // Only in anon/service role tokens
}

export async function verifyToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const jwtToken =
			req.cookies[process.env.ACCESS_TOKEN_COOKIE as any]?.["data"]?.[
				"session"
			]?.["access_token"];
		if (!jwtToken) {
			return returnOpFailed("User is not authenticated.", 403);
		}
		const parsedParams = verifyJWTSchema.safeParse({
			token: jwtToken,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { token } = parsedParams.data;
		// await jwt.verify(
		// 	token,
		// 	JSON.stringify(process.env.JWT_SECRET),
		// 	function (err, decoded) {
		// 		if (err) {
		// 			throw new Error(
		// 				`Something went wrong when decoding JWT. Err: ${err}`,
		// 			);
		// 		}
		// 		req.body.token = decoded;
		// 		req.body.userid =
		// 			decoded &&
		// 			typeof decoded != "string" &&
		// 			(decoded as JwtPayload)["userId"]
		// 				? (decoded as JwtPayload)["userId"]
		// 				: "";
		// 	},
		// );
		const { data, error } = await supabase.auth.getClaims(token);
		if (error) {
			console.log(`Auth middleware error: ${error}`);
			throw new Error(
				`Something went wrong when decoding JWT. Err: ${JSON.stringify(error)}`,
			);
		}
		const status =
			data && (data.claims as unknown as JwtClaims)?.aud
				? (data.claims as unknown as JwtClaims).aud
				: "none";
		if (status != "authenticated") {
			console.log(
				`User not authenticated or something went wrong when getting status. Data ${JSON.stringify(data)}`,
			);
			return returnOpFailed("User is not authenticated.", 403);
		}
		req.body["token"] = data;
		next();
	} catch (err) {
		return res.status(403).send({
			status: 403,
			message: (err as Error).message,
		});
	}
}
