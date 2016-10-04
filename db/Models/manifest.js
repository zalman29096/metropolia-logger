module.exports = {
	"User": {
		schema: {
			username: String,
			password: String,
			
		}
	},
	"Application" : {
		schema : {
			name : String,
			userId : String,
			token : String,
			createdAt : Date,
			logsTotal : {type : Number, default : 0},
			lastAccessDate : Date
		}
	},
	"Log" : {
		schema : {
			applicationToken : String,
			userId : String,
			severity : String,
			message : {}
		}
	}
}