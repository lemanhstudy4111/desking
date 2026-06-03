import * as z from "zod";
import { validateOneHourBookTime } from "../utils.js";

export const createBookingSchema = z
	.object({
		userid: z.uuidv4(),
		deskid: z.int(),
		start_date: z.preprocess((val) => {
			const dateVal = new Date(val as string).toISOString();
			console.log(dateVal);
			return dateVal;
		}, z.iso.datetime()),
		end_date: z.preprocess((val) => {
			const dateVal = new Date(val as string).toISOString();
			console.log(dateVal);
			return dateVal;
		}, z.iso.datetime()),
	})
	.refine(
		({ start_date, end_date }) => validateOneHourBookTime(start_date, end_date),
		{
			error: "Date validation failed.",
		},
	);

export const createMultipleBookingsSchema = z.object({
	userid: z.uuidv4(),
	bookingsData: z.array(
		z
			.object({
				deskid: z.int(),
				start_date: z.preprocess((val) => {
					const dateVal = new Date(val as string).toISOString();
					console.log(dateVal);
					return dateVal;
				}, z.iso.datetime()),
				end_date: z.preprocess((val) => {
					const dateVal = new Date(val as string).toISOString();
					console.log(dateVal);
					return dateVal;
				}, z.iso.datetime()),
			})
			.refine(
				({ start_date, end_date }) =>
					validateOneHourBookTime(start_date, end_date),
				{
					error: "Date validation failed.",
				},
			),
	),
});
export const getAllBookingsSchema = z
	.object({
		userid: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : undefined),
			z.array(z.uuidv4()).min(1).optional(),
		),
		status: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : undefined),
			z.array(z.int().min(1)).optional(),
		),
		deskid: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : undefined),
			z.array(z.int()).min(1).optional(),
		),
		start_date: z
			.preprocess((val) => {
				return new Date(val as string).toISOString();
			}, z.iso.datetime())
			.optional(),
		end_date: z
			.preprocess((val) => {
				return new Date(val as string).toISOString();
			}, z.iso.datetime())
			.optional(),
		created_on: z
			.preprocess((val) => {
				return new Date(val as string).toISOString();
			}, z.iso.datetime())
			.optional(),
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
		userid: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : []),
			z.array(z.uuidv4()).optional(),
		),
		status: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : []),
			z.array(z.int().min(1)).optional(),
		),
		deskid: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : []),
			z.array(z.int()),
		),
		start_date: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
		end_date: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
		created_on: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
	})
	.refine(
		({ status, deskid, start_date, end_date, created_on }) =>
			status || deskid || start_date || end_date || created_on,
		{
			error: "At least one parameter for booking filtering.",
		},
	);

/*
export const getAllBookingsSchema = z
	.object({
		status: z.preprocess(
			(val) => (val ? JSON.parse(val as string) : []),
			z.array(z.int().min(1)).optional(),
		),
		start_date: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
		end_date: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
		created_on: z
			.preprocess((val) => {
				const dateVal = new Date(val as string).toISOString();
				console.log(dateVal);
				return dateVal;
			}, z.iso.datetime())

			.optional(),
	})
	.refine(
		({ status, start_date, end_date, created_on }) =>
			status || start_date || end_date || created_on,
		{
			error: "At least one parameter for booking filtering.",
		},
	);
*/

export const updateBookingSchema = z
	.object({
		id: z.uuidv4(),
		deskid: z.int(),
		start_date: z.preprocess((val) => {
			const dateVal = new Date(val as string).toISOString();
			console.log(dateVal);
			return dateVal;
		}, z.iso.datetime()),
		end_date: z.preprocess(
			(val) => new Date(val as string).toISOString(),
			z.iso.datetime(),
		),
	})
	.refine(
		({ start_date, end_date }) => validateOneHourBookTime(start_date, end_date),
		{
			error: "Date validation failed.",
		},
	);

export const deleteBookingSchema = z.object({
	id: z.uuidv4(),
});
