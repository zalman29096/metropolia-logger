class Auth{

	login(req, res, done){
		done.render({}, res)
		//this.render(res, {});
	}

	logout(req, res, done){
		req.logout();
		done.redirect("/", res)
	}
}

module.exports = Auth;