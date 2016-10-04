var uuid = require("uuid")
class Application{

	index(done){
		db.Application.find({userId : this.user._id}, function(err, apps){
			done.render({apps : apps}, err)
		})
	} 
	saveApp(done){
		done.requestData.userId = this.user._id;
		done.requestData.token = uuid.v1();
		done.requestData.lastAccessDate = new Date();
		db.Application.create(done.requestData, function(err){
			done.redirect("/application", err)
		})
	}
	removeApp(done){
		var conditions = {
			_id : done.requestData.id,
			userId : this.user._id
		}
		db.Application.remove(conditions, function(err){
			done.data(null, err)
		})
	}
}

module.exports = Application;