class Done{
	constructor(renderPath, isAuthenticated){
		this.viewPath = renderPath;
		this.isAuthenticated = isAuthenticated;
		this.allowedStatuses = [200, 404, 500];
	}

	status(status, res){
		if(!res || !res.status){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			status = parseInt(status);
			if(!status || this.allowedStatuses.indexOf(status)){
				Log.error("Provided status [{}] can't be parsed or not allowed")
				res.status(500);
				return;
			}
			res.status(status)
		}catch(e){
			Log.error("Unexpected error while sending response {}", e);
			res.status(500);
		}	
	}

	data(payload, res){
		if(!res || !res.send){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			if(!data){
				Log.error("Provided payload isn't valid")
				res.status(500);
				return;
			}
			res.send(payload)
		}catch(e){
			Log.error("Unexpected error while sending response {}", e);
			res.status(500);
		}	
	}

	render(payload, res){
		if(!res || !res.render){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			if(!payload){
				Log.error("Provided payload isn't valid")
				res.status(500);
				return;
			}
			payload.__isAuthenticated = this.isAuthenticated;
			res.render(this.viewPath, payload)
		}catch(e){
			Log.error("Unexpected error while sending response {}", e);
			res.status(500);
		}	
	}

	redirect(location, res){
		if(!res || !res.redirect){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			if(!location){
				Log.error("Provided location isn't valid")
				res.status(500);
				return;
			}
			res.redirect(location)
		}catch(e){
			Log.error("Unexpected error while sending response {}", e);
			res.status(500);
		}	
	}
}

module.exports = Done;