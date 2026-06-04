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
	createMultipleBookings,
	deleteBooking,
	getAllBookings,
	updateBooking,
} from "../controllers/booking.js";

export const bookingRouter = Router();

bookingRouter.post(`/create-single`, postRouteTemplate(createBooking));
bookingRouter.post(
	`/create-multiple`,
	postRouteTemplate(createMultipleBookings),
);
/*
bookingRouter.get(`/get/users`, searchRouteTemplate(getBookingsByUserid));
bookingRouter.get(
	`/get/desks`,,
	searchRouteTemplate(getBookingsByDeskid),
);
*/
bookingRouter.get(`/get`, searchRouteTemplate(getAllBookings));
bookingRouter.put(`/update`, updateRouteTemplate(updateBooking));
bookingRouter.delete(`/delete`, deleteRouteTemplate(deleteBooking));
