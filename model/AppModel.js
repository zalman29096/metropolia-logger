var mongoose = require("mongoose")
var appSchema = mongoose.Schema({
	authToken : String,
	name : String,
	short_name : String
});
var _App = mongoose.model('App', appSchema);

module.exports = _App;