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
	getAllBookings,
	updateBooking,
} from "../controllers/booking.js";
import { api_ver } from "../index.js";

export const bookingRouter = Router();

bookingRouter.post(`/create`, verifyToken, postRouteTemplate(createBooking));
/*
bookingRouter.get(`/get/users`, searchRouteTemplate(getBookingsByUserid));
bookingRouter.get(
	`/get/desks`,
	verifyToken,
	searchRouteTemplate(getBookingsByDeskid),
);
*/
bookingRouter.get(`/get`, verifyToken, searchRouteTemplate(getAllBookings));
bookingRouter.put(`/update`, verifyToken, updateRouteTemplate(updateBooking));
bookingRouter.delete(
	`/delete`,
	verifyToken,
	deleteRouteTemplate(deleteBooking),
);
