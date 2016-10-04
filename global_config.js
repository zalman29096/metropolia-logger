module.exports = {
	devMode : true,
	db : {
		ip : "127.0.0.1",
		port : 27017,
		name : "logger",
		objectPath : __dirname + "/db/DataBase.js"
	},
	utils : {
		objectPath : __dirname + "/static/Utils.js"
	},
	logger : {
		objectPath : __dirname + "/log/Logger.js"
	}
}