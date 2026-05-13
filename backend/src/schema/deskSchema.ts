import * as z from "zod";

export const createDeskSchema = z.object({
	name: z.string(),
	description: z.string().max(200).optional(),
	start_hour: z.iso.time({ precision: -1 }).optional(),
	end_hour: z.iso.time({ precision: -1 }).optional(),
});

export const getAllDeskInfoSchema = z.object({
	name: z.string().optional(),
	description: z.string().max(200).optional(),
	start_hour: z.iso.time({ precision: -1 }).optional(),
	end_hour: z.iso.time({ precision: -1 }).optional(),
});

export const getAllDesksStartDateEndDateSchema = z.object({
	start_date: z.preprocess((val) => {
		return new Date(val as string).toISOString();
	}, z.iso.datetime()),
	end_date: z.preprocess((val) => {
		return new Date(val as string).toISOString();
	}, z.iso.datetime()),
});

export const updateDeskSchema = z
	.object({
		id: z.preprocess((val) => Number(val), z.int()),
		name: z.string().optional(),
		description: z.string().max(200).optional(),
		start_hour: z.iso.time({ precision: -1 }).optional(),
		end_hour: z.iso.time({ precision: -1 }).optional(),
	})
	.refine(
		({ name, description, start_hour, end_hour }) =>
			name || description || start_hour || end_hour,
		{
			error: "At least one of name, description, start_hour, end_hour.",
		},
	);

export const deleteDeskSchema = z.object({
	id: z.preprocess((val) => Number(val), z.int()),
});
