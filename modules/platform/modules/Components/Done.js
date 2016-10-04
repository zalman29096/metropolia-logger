class Done{
	constructor(renderPath, req, res, route){
		this.req = req;
		this.res = res;
		this.mockCallback = false;
		this.route = route;
		this.params = route.params;
		this.requestData = req.body;
		this.url = req.get("host");
		if(typeof renderPath == "function"){
			mockCallback = renderPath;
		}else{
			this.viewPath = renderPath;
		}
		this.allowedStatuses = [200, 404, 500, 403];
	}

	status(status){
		if(this.mockCallback){
			this.mockCallback(status, "status");
			return;
		}
		if(!this.res || !this.res.status){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			status = parseInt(status);
			if(!status || this.allowedStatuses.indexOf(status) < 0){
				Log.error("Provided status [{}] can't be parsed or not allowed", status)
				this.res.sendStatus(500);
				return;
			}
			this.res.sendStatus(status)
		}catch(e){
			Log.error("Unexpected error while sending response", e);
			this.res.sendStatus(500);
		}	
	}

	data(payload, err, errorPayload){

		var defaultPayload = __CONFIG.responseProcessor.defaultSuccessfulResponse;

		if(this.mockCallback){
			this.mockCallback("data", payload, err, errorPayload);
			return;
		}
		if(!this.res || !this.res.send){
			Log.error("Provided response object is not valid");
			return;
		}
		if(err){
			Log.warning("Error happened during request proccessing : '{}'. Replying with negative status", err);
			if(typeof errorPayload == "string"){
				var tmpErr = __CONFIG.responseProcessor.defaultFailedResponse;
				tmpErr.message = errorPayload;
				errorPayload = tmpErr;
			}
			payload = errorPayload || __CONFIG.responseProcessor.defaultFailedResponse;
		}
		try{
			if(!payload){
				payload = defaultPayload;
				Log.warning("Provided payload is empty, substituting with default one")
			}
			if(!payload.success && payload.success !== false && typeof payload !== "string"){
				payload = {success: true, data : payload}
			}
			this.res.send(payload)
		}catch(e){
			Log.error("Unexpected error while sending response", e);
			this.res.sendStatus(500);
		}	
	}

	renderNoAccess(message){
		this.render({message : message}, null, "__layout/error/accessDenied.ejs");
	}

	render(payload, error, specialView){
		if(this.mockCallback){
			this.mockCallback(payload, "render");
			return;
		}
		if(!this.res || !this.res.render){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			if(!payload){
				Log.error("Provided payload isn't valid")
				this.res.sendStatus(500);
				return;
			}
			payload.__isAuthenticated = this.req.isAuthenticated();
			try{
				var _this = this;
				if(this.req.session.passport ){
					payload.__user = this.req.session.passport.user || {};
					payload.__isAuthenticated = this.req.isAuthenticated();
					payload.__title = payload.title || "";
					payload.__module = this.route.module;
					payload.__action = this.route.action;
					payload.__ERROR = error;
				}
				//Log.debug(payload)
				this.res.render(specialView || this.viewPath, payload)
			}catch(e){
				Log.error("Error : {}", e);
			}	
		}catch(e){
			Log.error("Unexpected error while rendering", e);
			this.res.sendStatus(500);
		}	
	}

	redirect(location){
		if(this.mockCallback){
			this.mockCallback(location, "redirect");
			return;
		}
		if(!this.res || !this.res.redirect){
			Log.error("Provided response object is not valid");
			return;
		}
		try{
			if(!location){
				Log.error("Provided location isn't valid")
				this.res.sendStatus(500);
				return;
			}
			this.res.redirect(location)
		}catch(e){
			Log.error("Unexpected error while sending response", e);
			this.res.sendStatus(500);
		}	
	}
}

module.exports = Done;