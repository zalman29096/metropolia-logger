var colors = require('colors');
var fs = require("fs");

class Logger{

	constructor(){
		this.types = {
			"error" : {
				"color" : "red"
			},
			"warning" : {
				"color" : "blue"
			},
			"debug" : {
				"color" : "magenta"
			},
			"info" : {
				"color" : "green"
			}
		}
	}

	error(str, ...args){
		this._log(str, args, "error");
	}
	
	warning(str, ...args){
		this._log(str, args, "warning");
	}

	info(str, ...args){
		this._log(str, args, "info");
	}

	debug(str, ...args){
		this._log(str, args, "debug");
	}

	

	_log(str, args, type){
		
		//if(this.settings.addTimestamp) str = $.concat(" ", "[" + Helper.formatDate(new Date()) + "]", str);
		str = $.concat(" ", "[" + type.toUpperCase() + "]",str);
		console.log($.substitute(str, args)[this.types[type].color])
		
	}

}

module.exports = Logger
