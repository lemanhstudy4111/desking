import * as z from "zod";

export const createBookingSchema = z.object({
	userid: z.uuidv4(),
	status: z.int().min(1),
	deskid: z.uuidv4(),
	start_date: z.iso.datetime({ precision: -1 }),
	end_date: z.iso.datetime({ precision: -1 }),
});

export const getBookingByUseridSchema = z
	.object({
		userid: z.uuidv4(),
		status: z.int().min(1).optional(),
		deskid: z.uuidv4().optional(),
		start_date: z.iso.datetime({ precision: -1 }).optional(),
		end_date: z.iso.datetime({ precision: -1 }).optional(),
		created_on: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, deskid, start_date, end_date, created_on }) =>
			status || deskid || start_date || end_date || created_on,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

export const getBookingsByDeskidSchema = z
	.object({
		userid: z.uuidv4().optional(),
		status: z.int().min(1).optional(),
		deskid: z.uuidv4(),
		start_date: z.iso.datetime({ precision: -1 }).optional(),
		end_date: z.iso.datetime({ precision: -1 }).optional(),
		created_on: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, deskid, start_date, end_date, created_on }) =>
			status || deskid || start_date || end_date || created_on,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

export const getAllBookingsSchema = z
	.object({
		status: z.int().min(1).optional(),
		start_date: z.iso.datetime({ precision: -1 }).optional(),
		end_date: z.iso.datetime({ precision: -1 }).optional(),
		created_on: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ status, start_date, end_date, created_on }) =>
			status || start_date || end_date || created_on,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

export const updateBookingSchema = z
	.object({
		id: z.uuidv4(),
		userid: z.uuidv4().optional(),
		status: z.int().min(1).optional(),
		deskid: z.uuidv4().optional(),
		start_date: z.iso.datetime({ precision: -1 }).optional(),
		end_date: z.iso.datetime({ precision: -1 }).optional(),
	})
	.refine(
		({ userid, status, deskid, start_date, end_date }) =>
			userid || status || deskid || start_date || end_date,
		{
			error:
				"At least one of userid, status, deskid, start date, end date for booking update.",
		},
	);

export const deleteBookingSchema = z.object({
	id: z.uuidv4(),
});
