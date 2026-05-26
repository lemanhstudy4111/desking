import sql from "../db.js";
import {
	createDeskSchema,
	deleteDeskSchema,
	getAllDeskInfoSchema,
	getAllDesksStartDateEndDateSchema,
	getDeskUnavailableDaysSchema,
	updateDeskSchema,
} from "../schema/deskSchema.js";
import {
	returnGeneralError,
	returnOpFailed,
	returnSuccess,
	returnValidationError,
} from "../error.js";
import { isAdmin } from "../utils.js";

interface DeskType {
	name: string;
	description: string;
	start_hour: string;
	end_hour: string;
}

export async function createDesk(desk: DeskType, queryUser: string) {
	try {
		const parsedParams = createDeskSchema.safeParse(desk);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const parsedData = parsedParams.data;
		if (!(await isAdmin(queryUser))) {
			return returnOpFailed("Forbidden action.", 403);
		}
		const deskCreated = await sql`
            INSERT INTO desk ${sql(desk, Object.keys(parsedData) as any)}
			RETURNING id, name, description, start_hour, end_hour
        `;
		return returnSuccess(deskCreated);
	} catch (err) {
		return returnGeneralError(err);
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
		const parsedParams = getAllDeskInfoSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { name, description, start_hour, end_hour } = parsedParams.data;
		const nameIs = (x: string) => sql`AND name LIKE ${`%${x}%`}`;
		const descriptionHas = (x: string) =>
			sql`AND LOWER(description) LIKE ${`%${x}%`}`;
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
		return returnSuccess(allDesks);
	} catch (err) {
		return returnGeneralError(err);
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
		const parsedParams = getAllDesksStartDateEndDateSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { start_date, end_date } = parsedParams.data;
		const allDeskStatus = await sql`
			SELECT * FROM all_desks_status
			WHERE (start_date >= ${start_date} AND end_date <= ${end_date}) OR (start_date IS NULL) OR (end_date IS NULL)
			LIMIT ${count}
			OFFSET ${(page - 1) * count}
		`;
		return returnSuccess(allDeskStatus);
	} catch (err) {
		return returnGeneralError(err);
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
		const parsedParams = getAllDesksStartDateEndDateSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { start_date, end_date } = parsedParams.data;
		const allDeskStatus = await sql`
			SELECT ads.id, ads.name, ads.description, ads.start_hour, ads.end_hour
			FROM all_desks_status ads
			WHERE ${start_date} >= ads.end_date OR ${end_date} <= ads.start_date OR ads.desk_status = 'available'
			LIMIT ${count}
			OFFSET ${(page - 1) * count}
		`;
		return returnSuccess(allDeskStatus);
	} catch (err) {
		return returnGeneralError(err);
	}
}

export async function getUnavailableDaysByDesks(
	params: {
		deskid: number;
		start_date: Date | string;
		end_date: Date | string;
	},
	page: number = 1,
	count: number = 10,
) {
	try {
		const parsedParams = getDeskUnavailableDaysSchema.safeParse(params);
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		const { deskid, start_date, end_date } = parsedParams.data;
		const unavailableDays = await sql`
			SELECT id, start_date, end_date FROM all_desks_status
			WHERE deskid = ${deskid} AND ${start_date} BETWEEN start_date and end_date AND ${end_date} BETWEEN start_date and end_date
		`;
		return unavailableDays;
	} catch (err) {
		return returnGeneralError(err);
	}
}

//update
export async function updateDesk(
	deskid: number,
	newDeskInfo: any,
	queryUser: string,
) {
	try {
		const parsedParams = updateDeskSchema.safeParse({
			id: deskid,
			...newDeskInfo,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		if (!(await isAdmin(queryUser))) {
			return returnOpFailed("Forbidden action.", 403);
		}
		const { token, ...desksInfo } = newDeskInfo;
		const cols = Object.keys(desksInfo);
		const updatedDesk = await sql`
			UPDATE desk SET ${sql(desksInfo, cols)}
			WHERE id = ${deskid}
			RETURNING id, name, description, start_hour, end_hour
		`;
		return returnSuccess(updatedDesk);
	} catch (err) {
		return returnGeneralError(err);
	}
}

//delete
export async function deleteDesk(deskid: string, queryUser: string) {
	try {
		const parsedParams = deleteDeskSchema.safeParse({
			id: deskid,
		});
		if (!parsedParams.success) {
			return returnValidationError(parsedParams.error);
		}
		if (!(await isAdmin(queryUser))) {
			return returnOpFailed("Forbidden action.", 403);
		}
		const deletedDesk = await sql`
			DELETE FROM desk
			WHERE id = ${deskid}
		`;
		return returnSuccess(deletedDesk);
	} catch (err) {
		return returnGeneralError(err);
	}
}
