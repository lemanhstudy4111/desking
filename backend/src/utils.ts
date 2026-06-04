import sql from "./db.js";

export function camelToSnakeCase(str: string) {
	let res = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i] == (str[i] as string).toUpperCase()) {
			res += `_${(str[i] as string).toLowerCase()}`;
		} else {
			res += str[i];
		}
	}
	return res;
}

export function validateOneHourBookTime(
	startDate: string,
	endDate: string,
): boolean {
	try {
		const diffTime = Date.parse(endDate) - Date.parse(startDate);
		if (diffTime < 3600) return false;
		else return true;
	} catch (err) {
		console.log(`Date validation failed: ${err}`);
		return false;
	}
}

export async function isAdmin(userid: string) {
	const role = await sql`SELECT role FROM "users" WHERE id=${userid}`;
	return role && role.length > 0 && role[0]?.["role"] == 2;
}

export function findAllIndicesRegex(str: string, substr: string) {
	const indices: number[] = [];
	if (substr.length == 0) return indices;
	const regex = new RegExp(substr, "gi");
	let match;
	while ((match = regex.exec(str)) !== null) {
		indices.push(match.index);
	}
	return indices;
}
