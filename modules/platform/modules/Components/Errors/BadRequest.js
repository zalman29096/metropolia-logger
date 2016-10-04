var ExtError = require(__dirname + "/ExtendableError.js");

module.exports = {
	MissingPayloadProperty : class MissingPayloadPropertyError extends ExtError{
		constructor(property, message){
			super(message || "MISSING_PAYLOAD_PROPERTY [" + property + "]")
			this.missingProperty = property || "UNKNOWN_PROPERTY";
		}
	},
	PropertyMissmatch : class PropertyMissmatchError extends ExtError{
		constructor(args){
			super(args.message || "PAYLOAD_PROPERTY_DONT_MATCH")
			this.missingProperty = args.property || "UNKNOWN_PROPERTY";
			this.payload = args.payload;
			this.matchContext = args.context || "UNKNOWN_CONTEXT";
			this.expectedType = args.expectedType || "UNKNOWN_EXPECTED_TYPE";
			this.actualType  = args.actualType || typeof this.payload;
		}
	}
}
