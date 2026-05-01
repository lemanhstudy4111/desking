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

export const getAllDesksStartDateEndDate = z.object({
	start_date: z.iso.time({ precision: -1 }),
	end_date: z.iso.time({ precision: -1 }),
});

export const updateDeskSchema = z
	.object({
		id: z.int(),
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
	id: z.int(),
});
