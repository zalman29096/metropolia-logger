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
			}
		}
	}
}