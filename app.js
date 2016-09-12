var express = require('express'); 
var fs = require('fs');
var mongoose = require('mongoose');

var passport = require('passport');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')( expressSession );
var LocalStrategy = require('passport-local').Strategy;
var engine = require('ejs-mate');
var bodyParser = require("body-parser"); 
var cookieParser = require('cookie-parser');
var bCrypt = require('bcryptjs');
var app = express();
mongoose.connect("mongodb://localhost:27017/logger");

global.$ = new (require("./helper.js"))()
global.Log = new (require("./logger.js"))();

var MainModule = new (require("./module/main.js"))();
MainModule.init("modules", "Module", $.concat("/", __dirname, "module"));
MainModule.init("models", "Model", $.concat("/", __dirname, "model"));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false, limit: '8mb' }));
app.use(bodyParser.json({limit: '8mb'}));
app.use(express.static(__dirname + '/public'));

app.use(expressSession({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge : 3600000 },
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({
        mongooseConnection: mongoose.connection,
//                username: 'cm',
//                password: 'cm',
//                auth: false,
        collection: 'session',
        auto_reconnect: true
    })
}));


passport.serializeUser(function(user, done) {
	done(null, user);
});
 
passport.deserializeUser(function(user, done) {
	done(null, user);
});
app.use(passport.initialize());
app.use(passport.session())

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
}
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

passport.use('local-login', new LocalStrategy(
	function(username, password, done) {

		MainModule._getModel("User").findOne({'username' : username }).lean().exec(function(err, user){
			console.log(err)
			console.log(user);
			if(err || !user){
				Log.error("User {} not found", username)
				return done(null, false);	
			}
			if (!isValidPassword(user, password)){
				Log.error("User {} entered invalid password", username)
				return done(null, false);
        	}
			Log.info("User {} logged in successfuly", username)
			return done(null, user);
		});
	})
);
app.get("/", function(req, res){
	res.redirect("/auth/login")
})
app.get("*", function(req, res){
	MainModule.routeRequest(req, res);
})


app.post('/login',
	passport.authenticate('local-login', {successRedirect : "/search", failureRedirect : "/auth/login"}));
		
app.listen(80)