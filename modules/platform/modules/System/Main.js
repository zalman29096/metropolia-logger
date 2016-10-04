var fs = require("fs");
var Done = require(__CONFIG.paths.modules  + "/" + __CONFIG.modules.doneObjectPath);

/**
 * Module is a middleware between HTTP request and invocation of action.
 * Contains prototypes of all application modules.
 * Executes validations over request in order to determine if request is valid and action can be executed or not
 * @constructor
 */
class MainModule{

	/**
	 * Loads modules manifest.
	 * Instantiates RequestDataProcessor.
	 */
	constructor(){
		this.Prototypes = {};
		this.ControllerManifest = require(__dirname + "/manifest.js");
		this.RequestDataProcessor =  require(__dirname + "/RequestDataProcessor.js");
	}

	/**
	 * Method called at begining of application.
	 * Loads all application modules prototypes according to manifest
	 */
	load(){

		for(var moduleName in this.ControllerManifest){

			Log.info("Loading app module {}", moduleName);

			var thisModuleManifest = this.ControllerManifest[moduleName];
			
			var moduleFileName = thisModuleManifest.file || $.concat(".", moduleName + "Module", "js");
			var ModuleObject = false;

			try{
				ModuleObject = require(__CONFIG.paths.modules + "/" + moduleFileName);
			}catch(e){
				Log.error("Can't include file of module {}", moduleName, e);
				continue;
			}
			this._validatePayloadSchema(moduleName, this.ControllerManifest[moduleName].methods);
			this.Prototypes[moduleName.toLowerCase()] = {
				object : ModuleObject,
				manifest : this.ControllerManifest[moduleName]
			}			
		}
		Log.info("__________________________ INITIALISED. APP RUNNING. __________________________ ");
	}

	invoke(route, req, res, next){

		var ModuleData = this.Prototypes[route.module];
		if(!ModuleData){
			res.sendStatus(404);
			return;
		}
		var ModuleManifest = ModuleData.manifest;
		var ActionManifest = ModuleManifest.methods[route.action];
		if(!ModuleManifest || !ActionManifest){
			Log.error("Manfest for request not found", route);
			res.sendStatus(404);
			return;
		}

		this._requestIsOfProperType(req, ActionManifest.method);
		this._userIsAuthenticated(req, ActionManifest.public);

		var DataProcessor = new (this.RequestDataProcessor)();

		req.body = this._parseBodyAsJson(req, ActionManifest);
	
		if(
			req.method.toLowerCase() == "post" && 
			ActionManifest.payloadSchema && 
			!ActionManifest.skipValidation && 
			ActionManifest.payloadSchema !== {}
		){
			req.body = DataProcessor.process(req, ActionManifest);
		}		
		var done = new Done(
			ActionManifest.view || $.concat("/", route.module, route.action),
			req,
			res,
			false,
			route
		);
		
		var Controller = new ModuleData.object();

		if(req.session && req.session.passport){
			Controller.user = req.session.passport.user;
			
		}

		Controller[route.action](done, req, res, next)

	}

	_parseBodyAsJson(req, manifest){
		if(req.body && manifest.payloadIsJson && manifest.payloadKey && typeof req.body[manifest.payloadKey] == "string" ){
			try{
				return JSON.parse(req.body[manifest.payloadKey]);
			}catch(e){
				Log.error("Request data can't be parsed as JSON");
				throw new Error("BAD_PAYLOAD");
			}
		}else{
			return req.body;
		}
	}
	
	_requestIsOfProperType(req, expected){
		if(req.method.toLowerCase() != expected.toLowerCase()){
			Log.error("Request method missmatch. Expected : {} Actual : {}", expected, req.method);
			throw new Error("TYPE_MISSMATCH");
		}
	}
	_userIsAuthenticated(req, isPublic){
		if(!isPublic && !req.isAuthenticated()){
			Log.error("User is not authenticated");
			throw new Error("NOT_AUTHENTICATED");
		}
	}
	_validatePayloadSchema(moduleName, methods){
		for(var actionName in methods){

			var schema = methods[actionName];
			if(
				!schema.payloadSchema && 
				!schema.skipValidation && 
				schema.method === "post" &&
				!schema.public	
			){
				Log.error("{}.{} has no request schema and validate flag is not set, aborting", moduleName, actionName);
				process.exit();
			}
			for(var key in schema.payloadSchema){
				var element = schema.payloadSchema[key];
				if(!element.type) continue;
				
				if(element.type === String){
					if(element.subtype && element.subtype != "ObjectId" && element.subtype != "Date")
						Log.warning("{}.{} -> '{}' has inappropriate 'subtype' property. \n\tExpected : 'Date' or 'ObjectId' \n\tActual : {}", moduleName, actionName, key, element.subtype)
				}

				if(element.type === Number){
					if(element.isFloat && (typeof element.toFixed !== "number" || element.toFixed < 0))
						Log.warning("{}.{} -> '{}' has inappropriate 'toFixed' property. \n\tExpected : Integer > 0 \n\tActual : {} {}", moduleName, actionName, key, typeof element.toFixed, element.toFixed)

				}
				
				
				if(element.match && typeof element.match !== "function")
					Log.warning("{}.{} -> '{}' has inappropriate 'match' property. \n\tExpected type : function \n\tActual type : {}", moduleName, actionName, key, typeof element.match);
				if(element.modify && typeof element.modify !== "function")
					Log.warning("{}.{} -> '{}' has inappropriate 'modify' property. \n\tExpected type : function \n\tActual type : {}", moduleName, actionName, key, typeof element.match)	
			}
		}
	}
}

module.exports = MainModule;