module.exports = {
	"auth" : {
		"methods":{
			"login" : {
				public : true
			},
			"logout" : {
				
			}
		}	
	},
	search : {
		"associatedModels" : [""],
		methods : {
			"index" :{

			}
		}	
	},
	income : {
		"associatedModels" : ["User", "Log", "App"],
		methods : {
			"post" : {
				public : true
			}
		}
	},
	app : {
		associatedModels : ["User", "App"],
		methods : {
			"index" : {},
			"add" : {},
			"remove" : {},
			"update" : {}
		}

	}
}