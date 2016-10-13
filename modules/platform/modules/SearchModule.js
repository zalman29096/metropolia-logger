class Search{

	index(done){
		db.Application.find({userId : this.user._id}, function(err, apps){
			done.render({apps : apps}, err)
		})
	}
	getResult(done){
		var searchEntity = done.requestData.search;
		var _this = this;
		searchEntity = searchEntity.split(" ").map((e) => { return e.trim()})
		searchEntity = searchEntity.map((e) => { 
			if(e.length == 1) return e;
			return {key : e[0], value : e[1]}
		}).filter((e) => {return !!e})
		var simpleSearch = [];
		var complexSearch = [];
		var ignoreSimple = false;
		for(var i=0; i < searchEntity.length; i++){
			if(searchEntity[i].hasOwnProperty("key")) complexSearch.push(searchEntity[i])
			else simpleSearch.push(searchEntity[i]);
		}
		
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
			Log.debug(searchCase
				.replace(/%TOKEN%/, done.requestData.token)
				.replace(/%USER_ID%/, this.user._id)
				.replace(/%SEARCH%/g, done.requestData.search));
		db.Log.find({
			
			"$where": eval(
				searchCase
				.replace(/%TOKEN%/, done.requestData.token)
				.replace(/%USER_ID%/, this.user._id)
				.replace(/%SEARCH%/g, done.requestData.search)
			)
		}, function(err, logs){
			done.data(logs, err)
		})
	}
}

module.exports = Search;