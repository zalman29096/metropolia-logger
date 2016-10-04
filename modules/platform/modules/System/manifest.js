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
					application : String,
					searchEntry : String
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
	}
}