module.exports = {
	devMode : true,
	db : {
		ip : "ds049476.mlab.com",
		port : 49476,
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