module.exports = {
	server : {
		port : 3000,
		name : "METROPOLIA-LOGGER",
		defaultDateFormat : "dd.mm.yyyy hh:ii:ss",
		defaultShortDateFormat : "dd.mm.yyyy"
	},
	paths : {
		core : __ROOT__ + "/core",
		modules : __ROOT__ + "/modules",
		models : __ROOT__ + "/models",
		publicDir : __ROOT__ + "/public",
		view : __ROOT__ + "/view",
	},
	modules : {
		main : "System/Main.js",
		accessEngine : "System/AccessEngine.js",
		doneObjectPath : "Components/Done.js"
	},
	routes : {
		static : ["js", "css", "img", "fonts", "font-awesome"],
		paths : {
			"/" : "/auth/login",
		}	
	},
	requestProcessor : {
		Number : {
			defaultFloatLength : 3
		}
	},
	responseProcessor : {
		defaultSuccessfulResponse : {
			success : true
		},
		defaultFailedResponse : {
			success : false,
			message : "System failure. Try later"
		}
	},
	errors : {
		objectPath :  "Components/Errors/All.js"
	}
};