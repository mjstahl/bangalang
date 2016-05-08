export function getPrecedence(operator) {
	if (!operator) {
		return null;
	}

	const NOT_OPERATOR = null;
	const WORD_OPERATOR = 5;
	const CUSTOM_OPERATOR = 10;
	const operators = {
		"{": NOT_OPERATOR,
		"(": NOT_OPERATOR,
		"}": NOT_OPERATOR,
		")": NOT_OPERATOR,
		",": NOT_OPERATOR,
		";": 2,
		"=": 3,
		"+": 20,
		"-": 20,
		"/": 40,
		"*": 40,
	};

	if (operator in operators) {
		return operators[operator];
	}

	if (/^[A-Za-z0-9_]/.test(operator)) {
		return WORD_OPERATOR;
	}

	return CUSTOM_OPERATOR;
}

export function bindsToRight(operator) {
	return operator === ":";
}

export default {
	getPrecedence,
	bindsToRight,
	SMALL_PRECEDENCE: 4,
	LOW_PRECEDENCE: 0,
};
