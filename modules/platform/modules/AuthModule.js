class Auth{

	login(done){
		done.render({})
	}
	authenticate(done, req, res, next) {
		var _this = this;
		node_modules.passport.authenticate('local-login', function (err, user, info) {
			if (!user) return next(err);

			user.session_expired = new Date(Date.now() + 1800000);
			req.login(user, function (err) {
				if (err) return next(err);
				done.redirect('/search');
			});

		})(req, res, next);
	}
	logout(done, req){
		req.logout();
		done.redirect("/")
	}
	register(done){
		done.render({})
	}
	createUser(done){
		done.requestData.password = node_modules.bCrypt.hashSync(done.requestData.password)
		db.User.findOne({username : done.requestData.username}, function(err, us){
			if(err || us){
				done.redirect("/auth/register")
			}
			db.User.create(done.requestData, function(err1){
				done.redirect("/auth/login")
			})
		})
	}
}

module.exports = Auth;