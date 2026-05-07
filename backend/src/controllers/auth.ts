import { createClient } from "@supabase/supabase-js";
import {
	returnGeneralError,
	returnOpFailed,
	returnSuccess,
	returnValidationError,
} from "../error.js";
import { createUserSchema } from "../schema/userSchema.js";
import { signInUserSchema, verifyOTPSchema } from "../schema/authSchema.js";

export const supabase = createClient(
	`https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
	process.env.SUPABASE_PUBLISHABLE_KEY,
);

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
			return returnOpFailed(JSON.stringify(error));
		}
		return returnSuccess(data);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function signIn(email: string) {
	try {
		const parsedParams = signInUserSchema.safeParse({ email });
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
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
