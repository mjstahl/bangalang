export function scanner(text) {
	const REAL = "[0-9]+\\.[0-9]+";
	const INTEGER = "[0-9]+";
	const IDENTIFIER = "[@A-Za-z_][A-Za-z0-9_]*";
	const OPERATOR = ",|[(){}\\[\\]]|[+/*=<>:;!%&|\\-\\.]+";
	const WHITESPACE = "\\n|[\\r \\t]+";

	const pattern = new RegExp(`${REAL}|${INTEGER}|${IDENTIFIER}|${OPERATOR}|${WHITESPACE}`, "g");


	const matches = [];
	let match = pattern.exec(text);
	while (match !== null) {
		matches.push(match[0]);
		match = pattern.exec(text);
	}

	let index = -1;
	return {
		next() {
			index++;
			return {
				value: matches[index],
				done: index >= matches.length,
			};
		},
	};
}

export default {
	scanner,
};