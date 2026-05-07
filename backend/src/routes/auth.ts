import { Router, type Request, type Response } from "express";
import { signInPassword, signUp } from "../controllers/auth.js";

export const authRouter = Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
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

authRouter.post("/signin", async (req: Request, res: Response) => {
	try {
		if (!req || !req.body) {
			return res.status(400).send({
				message: "Invalid request.",
			});
		}
		const result = await signInPassword(req.body);
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
