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
			if (!req || !req.query) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const { page, count, ...params } = req.query;
			const result: ErrorResponse | SuccessResponse = await fn(
				params,
				page,
				count,
				req.body["token"]!["claims"]!["sub"],
			);
			console.log(result);
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
			const result: ErrorResponse | SuccessResponse = await fn(
				req.body,
				req.body["token"]!["claims"]!["sub"],
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

export function updateRouteTemplate(fn: any) {
	return async (req: Request, res: Response) => {
		try {
			if (!req || !req.body || !req.query.updateid) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const result: ErrorResponse | SuccessResponse = await fn(
				req.query.updateid,
				req.body,
				req.body["token"]!["claims"]!["sub"],
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
			if (!req || !req.params || !req.query.deleteid) {
				return res.status(400).send({
					message: "Invalid request.",
				});
			}
			const result: ErrorResponse | SuccessResponse = await fn(
				req.query.deleteid,
				req.body["token"]!["claims"]!["sub"],
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
