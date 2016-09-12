var mongoose = require("mongoose")
var logSchema = mongoose.Schema({
	
});
var _Log = mongoose.model('Log', logSchema);

module.exports = _Log;