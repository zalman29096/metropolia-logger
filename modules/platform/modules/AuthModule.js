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
}

module.exports = Auth;