import { success, ZodError } from "zod";

export function returnSuccess(data: any) {
	return {
		success: "true",
		data: data,
	};
}

export function returnGeneralError(err: any) {
	return {
		success: "false",
		message: `Something went wrong.`,
		error: err,
	};
}

export function returnValidationError(
	err: ZodError | any,
	errName: string = "custom validation",
) {
	return {
		success: "false",
		message: `Validation Error`,
		errorName: err.name ?? errName,
		zodErrorIssue: err.issues ? err.issues : "none",
	};
}

export function returnOpFailed(message: string) {
	return {
		success: "false",
		message: message,
	};
}
