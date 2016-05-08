import ast from "ast";

export function parse(tokens, ops) {
	let currentToken;

	function nextToken() {
		currentToken = tokens.next().value;
		if (currentToken && currentToken.trim() === "") {
			nextToken();
		}
	}

	function nextIdentifier() {
		const identifier = new ast.Identifier(currentToken);
		nextToken();

		return identifier;
	}

	function nextFnArguments(func) {
		return new ast.FnCall(func, nextArguments());
	}

	function nextPrimary() {
		if (!currentToken) {
			throw new SyntaxError("Unexpected end of input.");
		}

		let primary;
		if (currentToken === "fn") {
			primary = nextFnDefinition();
		} else if (currentToken === "{") {
			primary = nextParens();
		} else {
			primary = nextIdentifier();
		}

		while (currentToken === "(") {
			primary = nextFnArguments(primary);
		}
	}

	function nextBinaryOperator(precedence, lhs) {
		let left = lhs;
		for (;;) {
			const tokenPrec = ops.getPrecedence(currentToken);
			if (!tokenPrec || tokenPrec < precedence) {
				return left;
			}

			const operator = nextIdentifier();
			let right = nextPrimary();
			const nextTokenPrec = ops.getPrecedence(currentToken);
			if (nextTokenPrec) {
				let nextPrec;
				if (tokenPrec < nextTokenPrec) {
					nextPrec = tokenPrec + 1;
				} else if ((tokenPrec === nextTokenPrec) && ops.bindsToRight(operator.name)) {
					nextPrec = tokenPrec;
				}

				if (nextPrec) {
					right = nextBinaryOperator(nextPrec, right);
				}
			}

			left = new ast.FnCall(operator, [left, right]);
		}
	}

	function nextExpression(precedence) {
		return nextBinaryOperator(precedence, nextPrimary());
	}

	function nextArguments() {
		nextToken();

		const args = [];
		if (currentToken === ")") {
			nextToken();
			return args;
		}

		for (;;) {
			args.push(nextExpression());
			if (currentToken === ")") {
				nextToken();
				return args;
			}

			if (currentToken !== ",") {
				throw new SyntaxError(`Expected , but found ${currentToken}.`);
			}

			nextToken();
		}
	}

	function nextFnDefinition() {
		nextToken();
		if (currentToken !== "(") {
			throw new SyntaxError(`Expected ( in function definition but found ${currentToken}.`);
		}

		const args = nextArguments();
		const body = nextExpression(ops.SMALL_PRECEDENCE);
		return new ast.FnDefinition(args, body);
	}

	function nextParens() {
		nextToken();

		const expression = nextExpression(ops.LOW_PRECEDENCE);
		if (currentToken !== "}") {
			throw new SyntaxError(`Expected } but found ${currentToken}.`);
		}

		nextToken();
		return expression;
	}

	nextToken();
	const topExpression = nextExpression();
	if (currentToken) {
		throw new SyntaxError(`Text after the end of input: ${currentToken}.`);
	}

	return topExpression;
}

export default {
	parse,
};
