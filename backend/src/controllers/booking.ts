import { success } from "zod";
import sql from "../db.js";
import {
	createBookingSchema,
	getBookingByUseridSchema,
	getAllBookingsSchema,
	getBookingsByDeskidSchema,
	updateBookingSchema,
} from "../schema/bookingSchema.js";
import {
	returnGeneralError,
	returnOpFailed,
	returnSuccess,
	returnValidationError,
} from "../error.js";

interface BookingType {
	id: string | undefined;
	userid: string;
	deskid: string;
	start_date: Date;
	end_date: Date;
	createdOn: Date | undefined;
}

//create
export async function createBooking(booking: BookingType) {
	try {
		const parsedParams = createBookingSchema.safeParse(booking);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { userid, deskid, start_date, end_date } = parsedParams.data;
		const createdBooking = await sql.begin(async (sql) => {
			const isDeskBooked = await sql`
				SELECT EXISTS(SELECT 1 FROM booked_desks_with_names
				WHERE deskid = ${deskid} 
					AND (${end_date} >= b.end_date and ${start_date} <= b.start_date) 
					OR (${start_date} between b.start_date and b.end_date) 
					OR (${end_date} between b.start_date and b.end_date))
			`;
			if (
				isDeskBooked &&
				isDeskBooked.length > 0 &&
				isDeskBooked[0]?.["exists"] == "true"
			) {
				return returnOpFailed("Desk is already reserved");
			}
			const created = await sql`
				INSERT INTO booking (userid, status, deskid, start_date, end_date)
				VALUES (${userid}, 2, ${deskid}, ${start_date}, ${end_date})
			`;
			return returnSuccess(created);
		});
		return createdBooking;
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function createWaitlistBooking(booking: BookingType) {
	try {
		const parsedParams = createBookingSchema.safeParse(booking);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { userid, deskid, start_date, end_date } = parsedParams.data;
		const createdWaitlistBooking = await sql`
			INSERT INTO booking (userid, status, deskid, start_date, end_date)
			VALUES (${userid}, 1, ${deskid}, ${start_date}, ${end_date})
		`;
		return returnSuccess(createdWaitlistBooking);
	} catch (err) {
		return returnGeneralError(err);
	}
}

//read
export async function getBookingsByUserid(
	params: {
		userid: string[];
		deskid: number[] | undefined;
		start_date: Date | undefined;
		end_date: Date | undefined;
		status: number[] | undefined;
		created_on: Date[] | undefined;
	},
	page: number,
	count: number = 10,
) {
	try {
		const parsedParams = getBookingByUseridSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { userid, deskid, start_date, end_date, status, created_on } =
			parsedParams.data;
		const startDateFrom = (x: string) => sql`and start_date >= ${sql(x)}`;
		const endDateTo = (x: string) => sql`and end_date <= ${sql(x)}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const deskidIs = (x: number[]) => sql`and deskid in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const bookingsByUser = await sql`
            SELECT *
            FROM booking
            WHERE userid in ${sql(userid)} ${
							deskid ? deskidIs(deskid) : sql``
						} ${start_date ? startDateFrom(start_date) : sql``} ${
							end_date ? endDateTo(end_date) : sql``
						} ${status ? statusIs(status) : sql``} ${
							created_on && created_on.length == 2
								? createdOnBetween(
										created_on[0] as unknown as Date,
										created_on[1] as unknown as Date,
									)
								: sql``
						}
            LIMIT ${count}
            OFFSET ${(page - 1) * count}
        `;
		return returnSuccess(bookingsByUser);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function getBookingsByDeskid(
	params: {
		deskid: string[];
		userid: number[] | undefined;
		start_date: Date | undefined;
		end_date: Date | undefined;
		status: number[] | undefined;
		created_on: Date[] | undefined;
	},
	page: number,
	count: number = 10,
) {
	try {
		const parsedParams = getBookingsByDeskidSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const startDateFrom = (x: string) => sql`and start_date >= ${x}`;
		const endDateTo = (x: string) => sql`and end_date <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const userIdis = (x: string[]) => sql`and userid in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const { deskid, userid, start_date, end_date, status, created_on } =
			parsedParams.data;
		const bookingsByDesk = await sql`
            SELECT *
            FROM booking
            WHERE deskid in ${sql(deskid)} ${
							userid ? userIdis(userid) : sql``
						} ${start_date ? startDateFrom(start_date) : sql``} ${
							end_date ? endDateTo(end_date) : sql``
						} ${status ? statusIs(status) : sql``} ${
							created_on && created_on.length == 2
								? createdOnBetween(
										created_on[0] as unknown as Date,
										created_on[1] as unknown as Date,
									)
								: sql``
						}
            LIMIT ${count}
            OFFSET ${(page - 1) * count}
        `;
		return returnSuccess(bookingsByDesk);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function getAllBookings(
	params: {
		start_date: Date | undefined;
		end_date: Date | undefined;
		status: number[] | undefined;
		created_on: Date[] | undefined;
	},
	page: number,
	count: number = 10,
) {
	try {
		const parsedParams = getAllBookingsSchema.safeParse({
			...params,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const startDateFrom = (x: Date) => sql`and start_date >= ${x}`;
		const endDateTo = (x: Date) => sql`and end_date <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const allBookings = await sql`
            SELECT *
            FROM booking
            WHERE status in ${params.status ? statusIs(params.status) : sql([1, 2, 3, 4, 5])} 
                        ${params.start_date ? startDateFrom(params.start_date) : sql``} ${
													params.end_date ? endDateTo(params.end_date) : sql``
												} ${params.status ? statusIs(params.status) : sql``} ${
													params.created_on && params.created_on.length == 2
														? createdOnBetween(
																params.created_on[0] as unknown as Date,
																params.created_on[1] as unknown as Date,
															)
														: sql``
												}
            LIMIT ${count}
            OFFSET ${(page - 1) * count}
        `;
		return returnSuccess(allBookings);
	} catch (err) {
		return returnGeneralError(err);
	}
}

//update
export async function updateBooking(bookingId: string, newBooking: any) {
	try {
		const parsedParams = updateBookingSchema.safeParse({
			id: bookingId,
			...newBooking,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { deskid, start_date, end_date } = parsedParams.data;
		const updatedBooking = await sql.begin(async (sql) => {
			const isDeskBooked = await sql`
				SELECT EXISTS(SELECT 1 FROM booked_desks_with_names
				WHERE deskid = ${deskid} 
					AND (${end_date} >= b.end_date and ${start_date} <= b.start_date) 
					OR (${start_date} between b.start_date and b.end_date) 
					OR (${end_date} between b.start_date and b.end_date))
			`;
			if (
				isDeskBooked &&
				isDeskBooked.length > 0 &&
				isDeskBooked[0]?.["exists"] == "true"
			) {
				return returnOpFailed("Desk is already reserved");
			}
			const created = await sql`
				UPDATE booking SET deskid = ${deskid}, start_date = ${start_date}, end_date = ${end_date}
				WHERE deskid = ${deskid}
			`;
			return returnSuccess(created);
		});
		return updatedBooking;
	} catch (err) {
		return returnGeneralError(err);
	}
}

//delete
export async function deleteBooking(bookingId: string) {
	try {
		const parsedParams = updateBookingSchema.safeParse({
			id: bookingId,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const deletedBooking = await sql`
			DELETE FROM booking
			WHERE id = ${bookingId}
		`;
		returnSuccess(deletedBooking);
	} catch (err) {
		return returnGeneralError(err);
	}
}
