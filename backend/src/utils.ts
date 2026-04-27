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
