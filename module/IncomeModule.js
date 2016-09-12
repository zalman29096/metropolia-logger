class Search {

	post(req, res, done) {
		if (!req.data) {
			done.status(500, res);
			return;
		}
		var payload = false;
		try {
			payload = JSON.parse(req.data);
		} catch (e) {}
		
		if(!payload || !payload.authToken || !payload.severity || !payload.message){
			done.status(500, res);
			return;
		}
		var _this = this;
		this.App.findOne({authToken : payload.authToken},function(err, application){
			if(err || !application){
				Log.error("Requested app not found! App token : {}, error : {}", payload.authToken, err)
				done.data({success : false, status : 404, message : "App not found"}, res);
				return;
			}
			var logLine = {
				severity : payload.severity
			}
			Object.assign(logLine, payload.message);
			logLine.app = application._id;
			logLine.appIndex = application.short_name || application.name;
			_this.Log.collection.insert(logLine, function(err1){
				if(err1){
					Log.error("Can't insert log entry! error : {}", err1);
					done.data({success : false, status : 500, message : "Can't insert log entry"}, res)
					return;
				}
				done.data({success : true, status : 200}, res)
			})
		})
	}
}

module.exports = Search;