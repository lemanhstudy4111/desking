import { Router, type Request, type Response } from "express";
import {
	clearAccessCookie,
	logOut,
	setAccessCookie,
	signInPassword,
	signOut,
	signUp,
} from "../controllers/auth.js";

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
		console.log(result);
		if (result && result.success != "true") {
			console.log(result);
			return res.status(500).send({ ...result });
		}
		const { user, session } = (result as unknown as any).data;
		setAccessCookie(res, session["access_token"]);
		return res.status(200).send({
			success: result.success,
			data: user,
		});
	} catch (err) {
		return res.status(500).send({
			message: `Something went wrong. Err: ${err}`,
		});
	}
});

authRouter.get("/signout", async (req: Request, res: Response) => {
	try {
		if (!req || !req.body) {
			return res.status(400).send({
				message: "Invalid request.",
			});
		}
		const result = await signOut(req.body);
		console.log(result);
		if (result && result.success != "true") {
			console.log(result);
			return res.status(500).send({ ...result });
		}
		clearAccessCookie(res);
		return res.status(200).send({
			success: result.success,
			data: result,
		});
	} catch (err) {
		return res.status(500).send({
			message: `Something went wrong. Err: ${err}`,
		});
	}
});
