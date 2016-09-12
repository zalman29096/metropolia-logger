class Search{

	index(req, res, done){
		this.App.find({user_id : req.user._id}, function(err, apps){
			if(err || !apps){
				Log.error("Can't find apps for user {}", req.user._id);
				done.render({apps : []}, res);
				return;
			}
			done.render({apps : apps}, res);
		})
	}
}

module.exports = Search;