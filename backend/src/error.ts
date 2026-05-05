import { success } from "zod";

export function returnSuccess(data: any) {
	return {
		success: "true",
		data: data,
	};
}

export function returnGeneralError(err: any) {
	return {
		success: "false",
		message: `Something went wrong. Err: ${err}`,
	};
}

export function returnValidationError(err: any) {
	return {
		success: "false",
		message: `Validation Error: ${err}`,
	};
}

export function returnOpFailed(message: string) {
	return {
		success: "false",
		message: message,
	};
}
