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
