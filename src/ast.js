export class Identifier {
	constructor(name) {
		this.name = name;
	}

	evaluate(context, variables, continuation) {
		continuation(context.substitute(variables, this.name));
	}
}

export class FnDefinition {
	constructor(args, body) {
		this.args = args;
		this.body = body;
	}

	evaluate(context, variables, continuation) {
		const func = context.compile(variables, this.args, this.body);
		continuation(func);
	}
}

export class FnCall {
	constructor(func, args) {
		this.func = func;
		this.args = args;
	}

	evaluate(context, variables, continuation) {
		const args = this.args;
		function continueFunc(func) {
			const values = [];
			function continueArg(index, kontinuation) {
				function bindArgument(value) {
					values[index] = value;
					continueArg(index + 1, kontinuation);
				}
				if (index < args.length) {
					context.evaluateArgument(variables, func, index, args[index], bindArgument);
				} else {
					context.invoke(variables, func, values, kontinuation);
				}
			}
			continueArg(0, continuation);
		}
		this.func.evaluate(context, variables, continueFunc);
	}
}

export default {
	Identifier,
	FnDefinition,
	FnCall,
};
