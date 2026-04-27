import sql from "../db.js";
import {
	createBookingSchema,
	getBookingByUseridSchema,
	getAllBookingsSchema,
	getBookingsByDeskidSchema,
} from "../schema/bookingSchema.js";

interface Booking {
	id: string | undefined;
	userid: string;
	status: number;
	deskid: string;
	startDate: Date;
	endDate: Date;
	createdOn: Date | undefined;
}

//create
export async function createBooking(booking: Booking) {
	try {
		const parsedParams = createBookingSchema.safeParse(booking);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { userid, status, deskid, startDate, endDate } = booking;
		const bookingCreated = await sql`
            INSERT INTO booking (userid, status, deskid, startDate, endDate)
            VALUES (${userid}, ${status}, ${deskid}, ${startDate}, ${endDate})
        `;
		return { success: "true", data: bookingCreated };
	} catch (err) {
		return { success: "false", message: `Something went wrong. Err: ${err}` };
	}
}

//read
export async function getBookingsByUserid(
	userid: string[],
	params: {
		deskid: number[] | undefined;
		startDate: Date | undefined;
		endDate: Date | undefined;
		status: number[] | undefined;
		createdOn: Date[] | undefined;
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
		const startDateFrom = (x: Date) => sql`and startDate >= ${x}`;
		const endDateTo = (x: Date) => sql`and endDate <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const deskidIs = (x: number[]) => sql`and deskid in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const bookingsByUser = await sql`
            SELECT *
            FROM booking
            WHERE userid in ${sql(userid)} ${
							params.deskid ? deskidIs(params.deskid) : sql``
						} ${params.startDate ? startDateFrom(params.startDate) : sql``} ${
							params.endDate ? endDateTo(params.endDate) : sql``
						} ${params.status ? statusIs(params.status) : sql``} ${
							params.createdOn && params.createdOn.length == 2
								? createdOnBetween(
										params.createdOn[0] as unknown as Date,
										params.createdOn[1] as unknown as Date,
									)
								: sql``
						}
            LIMIT ${count}
            OFFSET ${(page - 1) * 10}
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
		startDate: Date | undefined;
		endDate: Date | undefined;
		status: number[] | undefined;
		createdOn: Date[] | undefined;
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
		const startDateFrom = (x: Date) => sql`and startDate >= ${x}`;
		const endDateTo = (x: Date) => sql`and endDate <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const userIdis = (x: number[]) => sql`and userid in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const bookingsByDesk = await sql`
            SELECT *
            FROM booking
            WHERE deskid in ${sql(deskid)} ${
							params.userid ? userIdis(params.userid) : sql``
						} ${params.startDate ? startDateFrom(params.startDate) : sql``} ${
							params.endDate ? endDateTo(params.endDate) : sql``
						} ${params.status ? statusIs(params.status) : sql``} ${
							params.createdOn && params.createdOn.length == 2
								? createdOnBetween(
										params.createdOn[0] as unknown as Date,
										params.createdOn[1] as unknown as Date,
									)
								: sql``
						}
            LIMIT ${count}
            OFFSET ${(page - 1) * 10}
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
		startDate: Date | undefined;
		endDate: Date | undefined;
		status: number[] | undefined;
		createdOn: Date[] | undefined;
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
		const startDateFrom = (x: Date) => sql`and startDate >= ${x}`;
		const endDateTo = (x: Date) => sql`and endDate <= ${x}`;
		const statusIs = (x: number[]) => sql`and status in ${sql(x)}`;
		const createdOnBetween = (from: Date, to: Date) =>
			sql`and createdOn between ${from} and ${to}`;
		const allBookings = await sql`
            SELECT *
            FROM booking
            WHERE status in ${params.status ? statusIs(params.status) : sql([1, 2, 3, 4, 5])} 
                        ${params.startDate ? startDateFrom(params.startDate) : sql``} ${
													params.endDate ? endDateTo(params.endDate) : sql``
												} ${params.status ? statusIs(params.status) : sql``} ${
													params.createdOn && params.createdOn.length == 2
														? createdOnBetween(
																params.createdOn[0] as unknown as Date,
																params.createdOn[1] as unknown as Date,
															)
														: sql``
												}
            LIMIT ${count}
            OFFSET ${(page - 1) * 10}
        `;
		return { success: "true", data: allBookings };
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}
