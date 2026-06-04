import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Router } from "express";
import { getDeskUnavailableDaysSchema } from "../schema/deskSchema.js";
import { returnValidationError } from "../error.js";
import { parse } from "node:path";

dotenv.config();
export const supabase = createClient(
	`https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
	process.env.SUPABASE_PUBLISHABLE_KEY!,
);

export const realtimeRouter = Router();

realtimeRouter.get("/desks", async (req, res) => {
	try {
		if (!req || !req.query) {
			return res.status(400).send({
				message: "Invalid request.",
			});
		}
		const { page, count, ...params } = req.query;
		const parsedParams = getDeskUnavailableDaysSchema.safeParse(params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.send({ ...returnValidationError(parsedParams.error) });
		}
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();
		res.write(`data: Connected to server\n`);
		const bookingId = "id";
		await supabase.realtime.setAuth(); // Needed for Realtime Authorization
		const changes = supabase
			.channel(`topic:${bookingId}`, {
				config: { private: true },
			})
			.on("broadcast", { event: "INSERT" }, (payload) =>
				res.write(`Booking table update. Data: ${payload}`),
			)
			.on("broadcast", { event: "UPDATE" }, (payload) =>
				res.write(`Booking table update. Data: ${payload}`),
			)
			.on("broadcast", { event: "DELETE" }, (payload) =>
				res.write(`Booking table delete. Data: ${payload}`),
			)
			.subscribe();
		req.on("close", () => {
			res.end();
		});
	} catch (err) {
		res.status(500).send({
			message: `Something went wrong. Realtime channel disconnected. Err: ${err}`,
		});
		return res.end();
	}
});
