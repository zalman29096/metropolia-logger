var mongoose = require("mongoose")
var userSchema = mongoose.Schema({
	username : String,
	password : String
});
var _User = mongoose.model('User', userSchema);

class User extends _User{}

module.exports = _User;