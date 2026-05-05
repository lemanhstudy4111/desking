import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

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
		const token = req.header("Authorization");
		if (!token) {
			throw new ValidationError(
				"Missing authorization token.",
				"auth",
				ValidationErrorType.MISSING,
			);
		}
		await jwt.verify(
			token,
			JSON.stringify(process.env.JWT_SECRET),
			function (err, decoded) {
				if (err) {
					throw new ValidationError(err.message, "auth", err.name);
				}
				req.body.token = decoded;
				req.body.userid =
					decoded &&
					typeof decoded != "string" &&
					(decoded as JwtPayload)["userId"]
						? (decoded as JwtPayload)["userId"]
						: "";
			},
		);
		next();
	} catch (err) {
		return res.status(403).send({
			status: 403,
			field: err.field,
			code: err.code,
			message: err.message,
		});
	}
}
