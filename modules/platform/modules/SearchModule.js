class Search{

	index(done){
		db.Application.find({userId : this.user._id}, function(err, apps){
			done.render({apps : apps}, err)
		})
	}
	getResult(done){
		var searchEntity = done.requestData.search;
		var _this = this;
		var searchCase = "(function() {"+
				"if(this.applicationToken != '%TOKEN%' || this.userId != '%USER_ID%') return false;"+
				"var count = 0;"+
				"for (var key in this['message']) {"+
					"if (typeof this['message'][key] == 'string' && this['message'][key].indexOf('%SEARCH%') >= 0) {"+
						"count++;"+
					"}"+	
					"if (typeof this['message'][key] == 'number' && (this['message'][key] == parseInt('%SEARCH%') || this['message'][key] == parseFloat('%SEARCH%') )) {"+
						"count++;"+
					"}"+
				"}"+
				"return count > 0;"+
			"})"
			Log.debug(searchCase.replace(/%TOKEN%/, done.requestData.token).replace(/%USER_ID%/, this.user._id).replace(/%SEARCH%/g, done.requestData.search))
		db.Log.find({
			
			"$where": eval(searchCase.replace(/%TOKEN%/, done.requestData.token).replace(/%USER_ID%/, this.user._id).replace(/%SEARCH%/g, done.requestData.search))
		}, function(err, logs){
			done.data(logs, err)
		})
	}
}

module.exports = Search;