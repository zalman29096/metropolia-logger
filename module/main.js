var fs = require("fs");
var Done = require($.concat("/", __dirname, "Components/done.js"));
class MainModule{

	constructor(){
		this.Prototypes = {
			modules : {},
			models : {}
		};
		this.ControllerManifest = require(__dirname + "/manifest.js")

	}

	init(what, postfix, dir){
		var modules = fs.readdirSync(dir);
		var _this = this;
		for(var i = 0; i < modules.length; i++){
			var fileName = modules[i];
			if(!fileName.endsWith($.concat("", postfix,".js"))) return;
			try{
				var module = require($.concat("/", dir, fileName));
				var moduleName = fileName.slice(0, -(postfix.length+3)).toLowerCase();
				Log.debug("Loading {} {}", what.slice(0 ,-1), moduleName);

				_this.Prototypes[what][moduleName] = module;
			}catch(e){
				console.log(e)
				Log.error("Can't load {} prototype", fileName);
			}
		}
		for(var moduleName in this.Prototypes.modules){
			var assocModels = [];
			try{
				assocModels = this.ControllerManifest[moduleName].associatedModels;
				if(!assocModels) continue;
			}catch(e){
				continue;
			}
			assocModels.forEach((_modelName) => {
				if(!_modelName || _modelName == ""){
					return;
				}
				try{
					var model = _this.Prototypes.models[_modelName.toLowerCase()];
					if(!model){
						Log.error("Can't load model {} to controller {}", _modelName, moduleName);
						return;
					}
					_this.Prototypes[_modelName] = model;
				}catch(e){
					Log.error("Can't load model {} to controller {}", _modelName, moduleName);
				}
			})
		}
	}

	routeRequest(req, res){
		var reqMap = this._prepareMap(req);
		if(reqMap[1] == "favicon.jpg" || reqMap[0] == "favicon.ico"){
			res.sendStatus(200);
			return;
		}
		Log.info("Received request to /{}", reqMap.join("/"))
		var ControllerManifest = this.ControllerManifest[reqMap[0]];
		if(!ControllerManifest){
			Log.error("Manfest for request not found");
			res.send({result : false, status : 500})
			return;
		}
		var MethodManifest = ControllerManifest.methods[reqMap[1]];
		if(!MethodManifest){
			Log.error("Method not registered");
			res.send({result : false, status : 500})
			return;
		}
		
		if(!MethodManifest.public && !req.isAuthenticated()){
			Log.warning("Security violation");
			res.redirect("/auth/login");
			return;
		}
		var Controller = this._getController(reqMap[0]);
		if(!Controller){
			Log.error("Controller {} not found", reqMap[0]);
			res.send({result : false, status : 404});
			return;
		}
		var done = new Done(MethodManifest.view || $.concat("/", reqMap[0].toLowerCase(), reqMap[1].toLowerCase()), req.isAuthenticated());
		
		Controller[reqMap[1]](req, res, done)

	}

	_prepareMap(req){
		var retVal = [];
		
		retVal = req.params[0].split('/');
		retVal.shift();
		if(retVal.length == 1 || retVal[1] == ""){
			retVal[1] = "index";
		}
		//Log.debug(retVal);
		return retVal;
	}
	
	_getModel(name){
		var retVal = this.Prototypes.models[name.toLowerCase()];
		if(!retVal){
			Log.error("Model {} not found", name.toLowerCase());
			return null;
		}
		return retVal;
	}
	_getController(name){
		var retVal = this.Prototypes.modules[name.toLowerCase()];
		if(!retVal){
			Log.error("Controller {} not found", name.toLowerCase());
			return null;
		}
		return new retVal();
	}
}

module.exports = MainModule;