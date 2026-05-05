import { createClient } from "@supabase/supabase-js";
import {
	returnGeneralError,
	returnOpFailed,
	returnSuccess,
	returnValidationError,
} from "../error.js";
import { createUserSchema } from "../schema/userSchema.js";
import sql from "../db.js";

const supabase = createClient(
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
		});
		if (error) {
			return returnOpFailed(JSON.stringify(error));
		}
		if (!data["user"] || !data["user"]["id"]) {
			console.log(data);
			return returnOpFailed("Could not get user id and information.");
		}
		const userAuthId = data["user"]["id"];
		const newUserInfo = {
			email: email,
			password: password,
			firstname: firstname,
			lastname: lastname ?? null,
			user_authid: userAuthId,
		};
		const createdUser = await sql`
			INSERT INTO users ${sql(newUserInfo, "email", "password", "firstname", "lastname", "user_authid")}
		`;
		return returnSuccess(createdUser);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function signIn(email: string) {
	try {
		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
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
