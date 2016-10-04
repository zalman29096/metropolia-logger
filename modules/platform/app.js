global.node_modules = require(__dirname + "/node_modules.js");
global.__ROOT__ = __dirname;
global.__GLOBAL_CONFIG = require(__dirname + "/../../global_config.js");
global.__CONFIG = require(__dirname + "/config/app_config.js");
global.$ = new (require(__GLOBAL_CONFIG.utils.objectPath))();
global.ERRORS = require(__CONFIG.paths.modules + "/" + __CONFIG.errors.objectPath);
global.Log = new (require(__GLOBAL_CONFIG.logger.objectPath))();
global.db = require(__GLOBAL_CONFIG.db.objectPath)(Log)
global.trans = function(name) {
	var avaibleLang = [];
	return name;
};
node_modules.mongoose.Promise = node_modules.Promise;

var Router = require(__CONFIG.paths.core + "/Router.js")();

var app = node_modules.express();

global.MainModule = new (require(__CONFIG.paths.modules  + "/" + __CONFIG.modules.main))();
MainModule.load();

app.engine('ejs', node_modules.engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');
app.use(node_modules.cookieParser())
app.use(node_modules.bodyParser.urlencoded({ extended: false, limit: '12mb' }));
app.use(node_modules.bodyParser.json({ limit: '12mb' }));
app.use(node_modules.express.static('public'));

app.use(node_modules.expressSession({
	secret: 'secrettexthere',
	saveUninitialized: true,
	resave: true,
	cookie: { maxAge: 3600000 },
	store: new node_modules.MongoStore({
        mongooseConnection: node_modules.mongoose.connection,
        collection: 'session',
        auto_reconnect: true
    })
}));



node_modules.passport.serializeUser(function (user, done) {
	done(null, user);
});

node_modules.passport.deserializeUser(function (user, done) {
	done(null, user);
});
app.use(node_modules.passport.initialize());
app.use(node_modules.passport.session())

node_modules.passport.serializeUser(function(user, done) {
	done(null, user);
});
 
node_modules.passport.deserializeUser(function(id, done) {
	db.User.findOne({_id : id}, function(user){
		done(null, user);
	});
});

var isValidPassword = function(user, password){
	return node_modules.bCrypt.compareSync(password, user.password);
}
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

node_modules.passport.use('local-login', new node_modules.LocalStrategy(
	function (username, password, done) {
		db.User.findOne({ 'username': username }, function (err, user) {
			if (err || !user) {
				Log.error("User {} not found", username)
				return done(null, false);
			}
			if (!user.password || !password || !isValidPassword(user, password)) {
				Log.error("User {} entered invalid password", username)
				return done(null, false);
			}
			Log.info("User {} logged in successfuly", username)
			return done(null, user);
		});
	})
);

app.all("*", function (req, res, next) {
	try{
		var route = Router.getRoute(req);

		/*if(["favicon.ico", "favicon.jpg"].indexOf(route.module) >= 0 || ["favicon.ico", "favicon.jpg"].indexOf(route.action) >= 0 ){
			res.redirect("/img/favicon.ico");
			return;
		}*/
		if(route.module){
			try{
				MainModule.invoke(route, req, res, next);
				return;
			}catch(e){
				Log.error("Can't invoke {}.{}", route.module, route.action, e)
				if(e.message == "NOT_AUTHENTICATED"){
					if(req.method.toLowerCase() == "get")
						res.redirect("/auth/login")
					else
						res.sendStatus(401)
					return;
				}
				
				res.sendStatus(500);
				return;
			}
		}
		if(route.static){
			res.sendFile(route.path);
			return;
		}
		res.sendStatus(500);
	}catch(e){
		Log.error("Exception thrown while processing request to {}", req.params[0], e);
		res.sendStatus(500);
	}	
})


app.post('/login',
	node_modules.passport.authenticate(
		'local-login', 
		{ successRedirect: "/search", failureRedirect: "/auth/login" }
	)
);

app.listen(process.env.PORT || 8080)
