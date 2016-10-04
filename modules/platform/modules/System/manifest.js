module.exports = {
	"Auth": {
		methods: {
			"login": {
				public: true,
				method: "GET"
			},
			"authenticate": {
				public: true,
				method: "POST",
				payloadSchema: {
					"username": String,
					"password": String,
				}
			},
			"logout": {
				method: "GET",
				hasPayload: false,
				public: true
			},
			"register" : {
				method : "GET",
				public : true
			},
			"createUser" : {
				method : "POST",
				public : true,
				payloadSchema : {
					username : String,
					password : String
				}
			}
		}
	},
	"Search" :{
		methods : {
			"index" : {
				method : "GET"
			},
			"getResult" : {
				method : "POST",
				payloadSchema : {
					token : String,
					search : String
				}
			}
		}
	},
	"Application" : {
		methods : {
			"index" : {
				method : "GET"
			},
			"saveApp" : {
				method : "POST"
			},
			"removeApp" :{
				method : "POST",
				payloadSchema : {
					id : {
						elemType : String,
						subtype : "ObjectId"
					}
				}
			}
		}
	},
	"Postlog": {
		methods : {
			"index" : {
				method : "POST",
				payloadIsJson : true,
				payloadKey : "log",
				skipValidation : true
			}
		}
	}
}