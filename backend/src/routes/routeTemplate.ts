import type { Request, Response } from "express";

interface ErrorResponse {
	success: boolean;
	field: string | undefined;
	code: string | undefined;
	message: string;
}

interface SuccessResponse {
	success: boolean;
	data: any;
	message: string;
}

export function searchRouteTemplate(fn: any) {
	return async (req: Request, res: Response) => {
		try {
			if (!req || !req.params) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const params = { ...req.params };
			const result: ErrorResponse | SuccessResponse = await fn(
				params,
				req.params,
			);
			if (!result.success) {
				console.log(result);
				return res.status(500).send({
					...result,
				});
			}
			return res.status(200).send({
				...result,
			});
		} catch (err) {
			return res.status(500).send({
				message: `Something went wrong. Err: ${err}`,
			});
		}
	};
}

export function postRouteTemplate(fn: any) {
	return async (req: Request, res: Response) => {
		try {
			if (!req || !req.body) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const result: ErrorResponse | SuccessResponse = await fn(req.body);
			if (!result.success) {
				console.log(result);
				return res.status(500).send({
					...result,
				});
			}
			return res.status(200).send({
				...result,
			});
		} catch (err) {
			return res.status(500).send({
				message: `Something went wrong. Err: ${err}`,
			});
		}
	};
}

export function updateRouteTemplate(fn: any) {
	return async (req: Request, res: Response) => {
		try {
			if (!req || !req.body || !req.params.updateid) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const result: ErrorResponse | SuccessResponse = await fn(
				req.params.updateid,
				req.body,
			);
			if (!result.success) {
				console.log(result);
				return res.status(500).send({
					...result,
				});
			}
			return res.status(200).send({
				...result,
			});
		} catch (err) {
			return res.status(500).send({
				message: `Something went wrong. Err: ${err}`,
			});
		}
	};
}

export function deleteRouteTemplate(fn: any) {
	return async (req: Request, res: Response) => {
		try {
			if (!req || !req.params || !req.params.deleteid) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const result: ErrorResponse | SuccessResponse = await fn(
				req.params.deleteid,
			);
			if (!result.success) {
				console.log(result);
				return res.status(500).send({
					...result,
				});
			}
			return res.status(200).send({
				...result,
			});
		} catch (err) {
			return res.status(500).send({
				message: `Something went wrong. Err: ${err}`,
			});
		}
	};
}
