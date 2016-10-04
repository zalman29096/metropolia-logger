var MissingPayloadPropertyError = ERRORS.BadRequest.MissingPayloadProperty
var PayloadPropertyMissmatchError = ERRORS.BadRequest.PropertyMissmatch
var mongoose = require("mongoose");


class RequestDataProcessor{
	constructor(){}

	process(req, manifest){
		var _this = this;
		var data = req.body;
		var newData = {};
		if(manifest.hasPayload === false) return false;
		for(var key in manifest.payloadSchema){
			var schemaElement = manifest.payloadSchema[key];
			
			if(!schemaElement) continue;

			// If property explicitly set as NOT required and doesn't exist in actual data, go ahead
			if(schemaElement.required === false && !data[key])
				if(schemaElement.default || schemaElement.default === false)
					data[key] = schemaElement.default;
					
			if(!(data[key] || data[key] === false) && schemaElement.required !== false) throw new MissingPayloadPropertyError(key);

			if(schemaElement.required === false){
				if(data[key]) newData[key] = data[key]
				continue;
			}
			if(schemaElement === String || schemaElement.elemType === String){
				data[key] = _this._processString(data[key], schemaElement, key);
			}

			if(schemaElement === Number || schemaElement.elemType === Number){
				data[key] = _this._processNumber(data[key], schemaElement, key);
			}
			if(schemaElement === Boolean || schemaElement.elemType === Boolean){
				data[key] = _this._processBoolean(data[key], schemaElement, key);
			}
			if(schemaElement.elemMatch && typeof schemaElement.elemMatch === "function"){
				_this._processTestFunction(data[key], schemaElement.elemMatch, key);
			}
			if(schemaElement.modify && typeof schemaElement.modify === "function"){
				data[key] = schemaElement.modify(data[key]);
			}
			newData[key] = data[key]
		}
		if(manifest.keepExtraData)
			return data;
		else
			return newData;
	}

	_processTestFunction(payloadElement, testFunction, propertyName){
		try{
			if(!testFunction(payloadElement))
				throw new PayloadPropertyMissmatchError({
					propertyName : propertyName, 
					context : "MATCH_FUNCTION",
					payload : payloadElement
				});
			
		}catch(e){
			throw new PayloadPropertyMissmatchError({
				propertyName : propertyName, 
				context : "MATCH_FUNCTION",
				message : e.message,
				payload : payloadElement
			});
		}
		return true;		
	}

	_processString(payloadElement, elementSchema, propertyName){
		if(typeof payloadElement !== "string"){
			if(typeof payloadElement === "number" || typeof payloadElement === "boolean"){
				payloadElement = "" + payloadElement;
			}else{
				throw new PayloadPropertyMissmatchError({
					propertyName : propertyName, 
					context : "TYPE_VALIDATION",
					payload : JSON.stringify(payloadElement),
					expectedType : "String",
					actualType : typeof payloadElement
				});
			}
		}

		if(elementSchema.subtype){
			if(elementSchema.subtype == "ObjectId" ){
				if(!/^[0-9a-fA-F]{24}$/.test(payloadElement))
					throw new PayloadPropertyMissmatchError({
						propertyName : propertyName, 
						context : "CAST_ERROR",
						payload : JSON.stringify(payloadElement),
						expectedType : "String(ObjectId)"
					});
				else
					payloadElement = mongoose.Types.ObjectId(payloadElement)
			}
				

			if(elementSchema.subtype == "Date"){
				var prevWarn = console.warn;
				console.warn = function(){}
				var tempDate = Moment(payloadElement);
				if(!tempDate.isValid())
					tempDate = Moment(payloadElement, "DD.MM.YYYY")

				if(!tempDate.isValid())
					throw new PayloadPropertyMissmatchError({
						propertyName : propertyName, 
						context : "CAST_ERROR",
						payload : JSON.stringify(payloadElement),
						expectedType : "String(Date)"
					});
				else
					payloadElement = tempDate.toDate();
				console.warn = prevWarn;
			}
		}

		return payloadElement;
	}

	_processNumber(payloadElement, elementSchema, propertyName){

		var parseMethod = "parseInt";
		if(elementSchema.isFloat)
			parseMethod = "parseFloat";

		if(typeof payloadElement === "string")
			payloadElement = Number[parseMethod](payloadElement);
		if(typeof payloadElement === "boolean")
			payloadElement = payloadElement ? 1 : 0;

		if((!payloadElement && payloadElement !== 0) || typeof payloadElement !== "number")
			throw new PayloadPropertyMissmatchError({
				propertyName : propertyName, 
				context : "CAST_ERROR",
				message : "Cant cast payload element to number",
				payload : JSON.stringify(payloadElement),
				expectedType : "Number",
				actualType : typeof payloadElement
			});
		
		if(elementSchema.isFloat)
			payloadElement = parseFloat(payloadElement.toFixed(elementSchema.toFixed || __CONFIG.requestProcessor.Number.defaultFloatLength))

		return payloadElement;
	}
	_processBoolean(payloadElement, elementSchema, propertyName){

		return !!payloadElement;

	}
}

module.exports = RequestDataProcessor;