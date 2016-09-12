class GlobalHelperMethods{
	constructor(){}

	concat(pattern, ...args){
		return args.join(pattern);
	}
	
	formatDate(date, format){
	
		if( !date ) {
			return '';
		}

		if( !format ) {
			format = 'dd.mm.yyyy hh:ii:ss';
		}

		var parseDate = new Date( date );
		var frmt = '';

		frmt = format.toLowerCase();

		frmt = frmt.replace( 'dd', (parseDate.getDate() > 9) ? parseDate.getDate() : "0"+parseDate.getDate() );
		frmt = frmt.replace( 'mm', (parseDate.getMonth() > 9) ? parseDate.getMonth() : "0"+parseDate.getMonth() );
		frmt = frmt.replace( 'yyyy', parseDate.getFullYear() );
		frmt = frmt.replace( 'hh', parseDate.getHours() );
		frmt = frmt.replace( 'ii', parseDate.getMinutes() );
		frmt = frmt.replace( 'ss', parseDate.getSeconds() );

		return frmt;

	}
	
	substitute(str, args){
		args.forEach((_arg) => {
			var argType = typeof _arg;
			
			if(argType == "string" || argType == "number"){
				str = str.replace(/{}/, _arg);
				return;
			}	
			
			if(argType == "object"){
				str = str.replace(/{}/, "\n" + JSON.stringify(_arg, null, 4) + "\n");
				return;
			}
		})
		return str;
	}
}

module.exports = GlobalHelperMethods;
