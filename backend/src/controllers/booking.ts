import { success } from "zod";
import sql from "../db.js";
import {
	createBookingSchema,
	getBookingByUseridSchema,
	getAllBookingsSchema,
	getBookingsByDeskidSchema,
	updateBookingSchema,
} from "../schema/bookingSchema.js";

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
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { userid, deskid, start_date, end_date } = parsedParams.data;
		const createdBooking = await sql.begin(async (sql) => {
			const isDeskAvailable = await sql`
				SELECT EXISTS(SELECT 1 FROM booked_desks_with_names
				WHERE deskid = ${deskid} 
					AND (${end_date} >= b.end_date and ${start_date} <= b.start_date) or (${start_date} between b.start_date and b.end_date) or (${end_date} between b.start_date and b.end_date))
			`;
			if (
				isDeskAvailable &&
				isDeskAvailable.length > 0 &&
				isDeskAvailable[0]?.["exists"] == "true"
			) {
				return {
					success: "false",
					message: "Desk is already reserved.",
				};
			}
			const created = await sql`
				INSERT INTO booking (userid, status, deskid, start_date, end_date)
				VALUES (${userid}, 2, ${deskid}, ${start_date}, ${end_date})
			`;
			return {
				success: "true",
				data: created,
			};
		});
		return createdBooking;
	} catch (err) {
		return { success: "false", message: `Something went wrong. Err: ${err}` };
	}
}

export async function createWaitlistBooking(booking: BookingType) {
	try {
		const parsedParams = createBookingSchema.safeParse(booking);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { userid, deskid, start_date, end_date } = parsedParams.data;
		const createdWaitlistBooking = await sql`
			INSERT INTO booking (userid, status, deskid, start_date, end_date)
			VALUES (${userid}, 1, ${deskid}, ${start_date}, ${end_date})
		`;
		return createdWaitlistBooking;
	} catch (err) {
		return { success: "false", message: `Something went wrong. Err: ${err}` };
	}
}

//read
export async function getBookingsByUserid(
	userid: string[],
	params: {
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
		const parsedParams = getBookingByUseridSchema.safeParse({
			userid: userid,
			...params,
		});
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { deskid, start_date, end_date, status, created_on } =
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
		return { success: "true", data: bookingsByUser };
	} catch (err) {
		return { success: "false", message: `Something went wrong. Err: ${err}` };
	}
}

export async function getBookingsByDeskid(
	deskid: string[],
	params: {
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
		const parsedParams = getBookingsByDeskidSchema.safeParse({
			deskid: deskid,
			...params,
		});
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const startDateFrom = (x: Date) => sql`and start_date >= ${x}`;
		const endDateTo = (x: Date) => sql`and end_date <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const userIdis = (x: number[]) => sql`and userid in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const bookingsByDesk = await sql`
            SELECT *
            FROM booking
            WHERE deskid in ${sql(deskid)} ${
							params.userid ? userIdis(params.userid) : sql``
						} ${params.start_date ? startDateFrom(params.start_date) : sql``} ${
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
		return { success: "true", data: bookingsByDesk };
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
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
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
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
		return { success: "true", data: allBookings };
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
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
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const updatedBooking = await sql`
			UPDATE booking SET ${sql(bookingId, newBooking)}
			WHERE id = ${bookingId}
		`;
		return {
			success: "true",
			data: updatedBooking,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}

//delete
export async function deleteBooking(bookingId: string) {
	try {
		const parsedParams = updateBookingSchema.safeParse({
			id: bookingId,
		});
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const deletedBooking = await sql`
			DELETE FROM booking
			WHERE id = ${bookingId}
		`;
		return {
			success: "true",
			data: deletedBooking,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}
