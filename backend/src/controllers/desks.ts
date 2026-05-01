import { success } from "zod";
import sql from "../db.js";
import {
	createDeskSchema,
	deleteDeskSchema,
	getAllDesksStartDateEndDate,
	updateDeskSchema,
} from "../schema/deskSchema.js";

interface DeskType {
	name: string;
	description: string;
	start_hour: string;
	end_hour: string;
}

export async function createDesk(desk: DeskType) {
	try {
		const parsedParams = createDeskSchema.safeParse(desk);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const parsedData = parsedParams.data;
		const deskCreated = await sql`
            INSERT INTO desk ${sql(desk, Object.keys(parsedData) as any)}
        `;
		return {
			success: "true",
			data: deskCreated,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}

export async function getAllDesksInfo(
	params?: {
		name?: string | undefined;
		description?: string | undefined;
		start_hour?: Date | string | undefined;
		end_hour?: Date | string | undefined;
	},
	page: number = 1,
	count: number = 10,
) {
	try {
		const parsedParams = createDeskSchema.safeParse(params);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { name, description, start_hour, end_hour } = parsedParams.data;
		const nameIs = (x: string) => sql`AND name LIKE '${x}'`;
		const descriptionHas = (x: string) =>
			sql`AND description LIKE '%${x}$' COLLATE case_insensitive true`;
		const startHourFrom = (x: string) => sql`AND start_hour >= ${sql(x)}`;
		const endHourTo = (x: string) => sql`AND end_hour <= ${sql(x)}`;
		const allDesks = await sql`
			SELECT * FROM desk
			WHERE id > 0 ${name ? nameIs(name) : sql``} ${
				description ? descriptionHas(description) : sql``
			} ${start_hour ? startHourFrom(start_hour) : sql``} ${
				end_hour ? endHourTo(end_hour) : sql``
			}
			LIMIT ${count}
			OFFSET ${(page - 1) * count}
		`;
		return {
			success: "true",
			data: allDesks,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}

export async function getAllDesksWithStatus(
	params: {
		start_date?: Date | string | undefined;
		end_date?: Date | string | undefined;
	},
	page: number = 1,
	count: number = 10,
) {
	try {
		const parsedParams = getAllDesksStartDateEndDate.safeParse(params);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { start_date, end_date } = parsedParams.data;
		const allDeskStatus = await sql`
			SELECT * FROM all_desks_status
			WHERE (start_date >= ${start_date} AND end_date <= ${end_date}) OR (start_date IS NULL) OR (end_date IS NULL)
			LIMIT ${count}
			OFFSET ${(page - 1) * count}
		`;
		return {
			success: "true",
			data: allDeskStatus,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}

export async function getAllAvailableDesks(
	params: {
		start_date?: Date | string | undefined;
		end_date?: Date | string | undefined;
	},
	page: number = 1,
	count: number = 10,
) {
	try {
		const parsedParams = getAllDesksStartDateEndDate.safeParse(params);
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const { start_date, end_date } = parsedParams.data;
		const allDeskStatus = await sql`
			SELECT ads.id, ads.name, ads.description, ads.start_hour, ads.end_hour
			FROM all_desks_status ads
			WHERE ${start_date} >= ads.end_date OR ${end_date} <= ads.start_date OR ads.desk_status = 'available'
			LIMIT ${count}
			OFFSET ${(page - 1) * count}
		`;
		return {
			success: "true",
			data: allDeskStatus,
		};
	} catch (err) {
		return {
			success: "false",
			message: `Something went wrong. Err: ${err}`,
		};
	}
}

//update
export async function updateDesk(deskid: number, newDeskInfo: any) {
	try {
		const parsedParams = updateDeskSchema.safeParse({
			id: deskid,
			...newDeskInfo,
		});
		if (!parsedParams.success) {
			return {
				success: "false",
				message: `Validation Error: ${parsedParams.error}`,
			};
		}
		const cols = Object(newDeskInfo).keys();
		const updatedBooking = await sql`
			UPDATE desk SET ${sql(newDeskInfo, cols)}
			WHERE id = ${deskid}
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
		const parsedParams = deleteDeskSchema.safeParse({
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
