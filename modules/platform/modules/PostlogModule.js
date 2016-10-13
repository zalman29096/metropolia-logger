var uuid = require("uuid")
class Postlog{

	index(done){
		Log.debug(done.requestData)
		db.Application.findOne({token : done.requestData.token}, function(err, app){
			if(err || !app){
				done.status(404)
			}
			db.Log.create({
				applicationToken : app.token,
				userId : app.userId,
				createdAt : new Date(),
				severity : done.requestData.severity || "info",
				message : done.requestData.message
			}, function(err1){
				if(!err1)
					
					db.Application.update({_id : app._id}, {"$set" : {"lastAccessDate" : new Date()}}, function(){
						db.Application.update({_id : app._id}, {"$inc" : {"logsTotal" : 1}}, function(){
							done.status(200)
						})
						
					})
					
			})
		})
	} 

}

module.exports = Postlog;