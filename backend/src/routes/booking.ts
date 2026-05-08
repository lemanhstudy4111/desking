import { Router, type Request, type Response } from "express";
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

export const bookingRouter = Router();

bookingRouter.post(`/create`, verifyToken, postRouteTemplate(createBooking));
bookingRouter.get(
	`/get/users`,
	verifyToken,
	searchRouteTemplate(getBookingsByUserid),
);
bookingRouter.get(
	`/get/desks`,
	verifyToken,
	searchRouteTemplate(getBookingsByDeskid),
);
bookingRouter.put(`/update`, verifyToken, updateRouteTemplate(updateBooking));
bookingRouter.delete(
	`/delete`,
	verifyToken,
	deleteRouteTemplate(deleteBooking),
);
