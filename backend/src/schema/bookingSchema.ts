import * as z from "zod";

export const createBookingSchema = z.object({
	userid: z.uuidv4(),
	status: z.int().min(1),
	deskid: z.uuidv4(),
	startDate: z.iso.datetime({ precision: -1 }),
	endDate: z.iso.datetime({ precision: -1 }),
});

export const getBookingByUseridSchema = z
	.object({
		userid: z.uuidv4(),
		status: z.int().min(1).optional(),
		deskid: z.uuidv4().optional(),
		startDate: z.iso.datetime({ precision: -1 }).optional(),
		endDate: z.iso.datetime({ precision: -1 }).optional(),
		createdOn: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, deskid, startDate, endDate, createdOn }) =>
			status || deskid || startDate || endDate || createdOn,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

export const getBookingsByDeskidSchema = z
	.object({
		userid: z.uuidv4().optional(),
		status: z.int().min(1).optional(),
		deskid: z.uuidv4(),
		startDate: z.iso.datetime({ precision: -1 }).optional(),
		endDate: z.iso.datetime({ precision: -1 }).optional(),
		createdOn: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, deskid, startDate, endDate, createdOn }) =>
			status || deskid || startDate || endDate || createdOn,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

export const getAllBookingsSchema = z
	.object({
		status: z.int().min(1).optional(),
		startDate: z.iso.datetime({ precision: -1 }).optional(),
		endDate: z.iso.datetime({ precision: -1 }).optional(),
		createdOn: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, startDate, endDate, createdOn }) =>
			status || startDate || endDate || createdOn,
		{
			error: "At least one parameter for booking filtering.",
		},
	);
