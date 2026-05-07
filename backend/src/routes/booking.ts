import type { Request, Response } from "express";
import { app } from "../index.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
	deleteRouteTemplate,
	postRouteTemplate,
	searchRouteTemplate,
	updateRouteTemplate,
} from "./routeTemplate.js";
import {
	createBooking,
	deleteBooking,
	getBookingsByDeskid,
	getBookingsByUserid,
	updateBooking,
} from "../controllers/booking.js";
import { api_ver } from "../index.js";

app.post(
	`/api/v${api_ver}/booking/create`,
	verifyToken,
	postRouteTemplate(createBooking),
);
app.get(
	`/api/v${api_ver}/booking/get/users`,
	verifyToken,
	searchRouteTemplate(getBookingsByUserid),
);
app.get(
	`/api/v${api_ver}/booking/get/desks`,
	verifyToken,
	searchRouteTemplate(getBookingsByDeskid),
);
app.put(
	`/api/v${api_ver}/booking/update`,
	verifyToken,
	updateRouteTemplate(updateBooking),
);
app.delete(
	`/api/v${api_ver}/booking/delete`,
	verifyToken,
	deleteRouteTemplate(deleteBooking),
);
