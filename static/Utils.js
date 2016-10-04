class GlobalHelperMethods {
	constructor() {}

	concat(pattern, ...args) {
		return args.join(pattern);
	}

	substitute(str, args) {
		if(str == "")
			str = (Array.apply(null, Array(args.length)).map(function (_val) { return "{}"; })).join(" ")
		args.forEach((_arg) => {
			var argType = typeof _arg;

			if (argType == "string" || argType == "number") {
				str = str.replace(/{}/, _arg);
				return;
			}

			if (argType == "object") {
				str = str.replace(/{}/, "\n" + JSON.stringify(_arg, null, 4) + "\n");
				return;
			}
		})
		return str;
	}

	formatDate(date, format = "DD.MM.YYYY"){
		var oldWarn = console.warn;
		console.warn = function(){}

		var tempDate = Moment(date);
		
		console.warn = oldWarn;
		if(!tempDate.isValid())
			return "";
		return tempDate.format(format)
	}

}

module.exports = GlobalHelperMethods;
