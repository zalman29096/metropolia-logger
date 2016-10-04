var fs = require("fs");
var mongoose = require("mongoose");
var __setOptions = mongoose.Query.prototype.setOptions;
var patchMongoose = require('mongoose-lean');
patchMongoose(mongoose);
var Log;

function extendFromFile(filename, manifest, name, MODEL_OBJECT){

	var ModelObject = require(__dirname + "/Models/" + filename)(manifest, MODEL_OBJECT);
	MODEL_OBJECT.custom = ModelObject
	return MODEL_OBJECT;
}

function loadModelFromSchema(manifest, name){
	var Schema = mongoose.Schema(manifest.schema);
	var mongooseModel = mongoose.model(name, Schema);
	return mongooseModel;
}

class DB{
	constructor(_Log){
		Log = _Log;
		this.config = require(__dirname + "/../global_config.js");

		mongoose.connect("mongodb://loggerman:metropolia123" + this.config.db.ip + ":" + this.config.db.port + "/" + this.config.db.name);

		try{
			var modelsManifest = require(__dirname + "/Models/manifest.js");
		}catch(e){
			Log.error(e);
		}

		for(var modelName in modelsManifest){

			Log.info("Loading model {}", modelName);

			var thisModelManifest = modelsManifest[modelName];
			if(!thisModelManifest.schema){
				Log.error("Model {} has no Schema", modelName);
				thisModelManifest.schema = {};
			}
			var modelFileName = thisModelManifest.file || $.concat(".", modelName, "js");
			var ModelObject = false;

			// Trying to load model from custom file
			ModelObject = loadModelFromSchema(thisModelManifest, modelName);
			try{
				ModelObject = extendFromFile(modelFileName, thisModelManifest, modelName, ModelObject);
			}catch(e){
				// Trying to load model from schema
				//Log.error("Can't load model {}", modelName, e);
				Log.warning("Can't extend model {} with file", modelName);			
			}
			if(ModelObject)	
				this[modelName] = ModelObject;
			else
				Log.error("Failed to load model {}", modelName);
			
		}
	}
}

module.exports = function(log){
	return new DB(log);
}