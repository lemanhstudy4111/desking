import { createClient } from "@supabase/supabase-js";
import {
	returnGeneralError,
	returnOpFailed,
	returnSuccess,
	returnValidationError,
} from "../error.js";
import { createUserSchema } from "../schema/userSchema.js";
import {
	signInUserOTPSchema,
	signInUserPasswordSchema,
	verifyJWTSchema,
	verifyOTPSchema,
} from "../schema/authSchema.js";
import dotenv from "dotenv";
import type { Response } from "express";

dotenv.config();
export const supabase = createClient(
	`https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
	process.env.SUPABASE_PUBLISHABLE_KEY!,
);

export function clearAccessCookie(res: Response) {
	res.clearCookie(process.env.ACCESS_TOKEN_COOKIE || "access_token");
}

export function setAccessCookie(res: Response, token: string) {
	const cookieName = process.env.ACCESS_TOKEN_COOKIE || "access_token";
	const isProd = process.env.NODE_ENV == "production";
	res.cookie(cookieName, token, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? "none" : "lax",
		maxAge: 15 * 60 * 1000,
		path: "/",
	});
}

export async function signUp(newUser: any) {
	try {
		const parsedParams = createUserSchema.safeParse(newUser);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { email, password, firstname, lastname } = parsedParams.data;
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					firstname: firstname,
					lastname: lastname,
				},
			},
		});
		if (error) {
			console.log("operation error ", error);
			return returnOpFailed(JSON.stringify(error));
		}
		return returnSuccess(data);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function signInPassword(userInfo: any) {
	try {
		const parsedParams = signInUserPasswordSchema.safeParse(userInfo);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		console.log(parsedParams.data.email);
		const { data, error } = await supabase.auth.signInWithPassword({
			email: parsedParams.data.email,
			password: parsedParams.data.password,
		});
		if (error) {
			return returnOpFailed(JSON.stringify(error), 401);
		}
		return returnSuccess(data);
	} catch (err) {
		return returnGeneralError(err);
	}
}

//TODO: later feature
export async function signInOTP(userInfo: any) {
	try {
		const parsedParams = signInUserOTPSchema.safeParse(userInfo);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		console.log(parsedParams.data.email);
		const { data, error } = await supabase.auth.signInWithOtp({
			email: parsedParams.data.email,
			options: {
				shouldCreateUser: false,
			},
		});
		if (error) {
			return returnOpFailed(JSON.stringify(error));
		}
		return returnSuccess(data);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function verifyOTP(email: string, OTP: number) {
	try {
		const parsedParams = verifyOTPSchema.safeParse({ email: email, otp: OTP });
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { data, error } = await supabase.auth.verifyOtp({
			email: parsedParams.data.email,
			token: parsedParams.data.token,
			type: "email",
		});
		if (error) {
			return returnOpFailed(JSON.stringify(error));
		}
		return returnSuccess(data);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function signOut(cookies: Record<string, any>) {
	try {
		const cookieName = process.env.ACCESS_TOKEN_COOKIE || "access_token";
		const jwt = cookies[cookieName];
		const parsedParams = verifyJWTSchema.safeParse({ token: jwt });
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { token } = parsedParams.data;
		const signedOut = await supabase.auth.admin.signOut(token);
		return returnSuccess(signedOut);
	} catch (err) {
		return returnGeneralError(err);
	}
}
