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

	error(...args){
		this._log(args, "error");
	}
	
	warning(...args){
		this._log(args, "warning");
	}

	info(...args){
		this._log(args, "info");
	}

	debug(...args){
		this._log(args, "debug");
	}

	

	_log(args, type){
		
		//if(this.settings.addTimestamp) str = $.concat(" ", "[" + Helper.formatDate(new Date()) + "]", str);
		var printVal = "";
		var substituteValues = [];
		var errors = [];
		var objects = [];
		if(args[0] && typeof args[0] == "string"){
			printVal = args[0];
			args.shift();
		}

		args.forEach((elem, i) => {
			
			if(elem instanceof Error){
				//printVal += "\nException : ";
				//printVal = $.concat(" ", elem.stack);
				errors.push(elem);
				return;
			}
			if(typeof elem === "object"){
				objects.push(elem);
				return;
			}
			substituteValues.push(elem + "");
		});
		
		console.log($.substitute(printVal, substituteValues)[this.types[type].color])
		objects.forEach((obj) => {
			console.log(JSON.stringify(obj, null, 4)[this.types[type].color]);
		})
		errors.forEach((err) => {
			console.log(err.stack[this.types[type].color]);
		})
		
	}
}

module.exports = Logger
