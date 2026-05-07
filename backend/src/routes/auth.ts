import { api_ver } from "../index.js";
import type { Request, Response } from "express";
import { app } from "../index.js";
import { signIn, signUp } from "../controllers/auth.js";

app.post(`/api/v${api_ver}/signup`, async (req: Request, res: Response) => {
	try {
		if (!req || !req.body) {
			return res.status(400).send({
				message: "Invalid request.",
			});
		}
		const result = await signUp(req.body);
		if (!result.success) {
			console.log(result);
			return res.status(500).send({ ...result });
		}
		return res.status(200).send({
			...result,
		});
	} catch (err) {
		return res.status(500).send({
			message: `Something went wrong. Err: ${err}`,
		});
	}
});

app.post(`/api/v${api_ver}/signin`, async (req: Request, res: Response) => {
	try {
		if (!req || !req.body) {
			return res.status(400).send({
				message: "Invalid request.",
			});
		}
		const result = await signIn(req.body);
		if (!result.success) {
			console.log(result);
			return res.status(500).send({ ...result });
		}
		return res.status(200).send({
			...result,
		});
	} catch (err) {
		return res.status(500).send({
			message: `Something went wrong. Err: ${err}`,
		});
	}
});
