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
				"var complexSearch = %IS_COMPLEX%;"
				"var simpleSearch = %SIMPLE_SEARCH%;"+
				"var complexSearch = %COMPLEX_SEARCH%;"+
				"for (var key in this['message']) {"+
					""
					"if (!complexSearch && simpleSearch.indexOf(this.['message'][key]) >= 0) {"+
						"count++;"+
					"}"+	
					
				"}"+
				"return count > 0;"+
			"})"
		db.Log.find({
			
			"$where": eval(
				searchCase
				.replace(/%TOKEN%/, done.requestData.token)
				.replace(/%USER_ID%/, this.user._id)
				.replace(/%IS_COMPLEX%/, complexSearch.length > 0)
				.replace(/%SEARCH%/g, done.requestData.search)
			)
		}, function(err, logs){
			done.data(logs, err)
		})
	}
}

module.exports = Search;