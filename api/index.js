var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(session({
  secret: 'fhtfrfghyh',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if(err)
          return done(err);
	  
        //Username does not exist, log error & redirect back
        if(!user){
          console.log('User Not Found with username '+username);
          return done(null, false , { success: '0' });                 
        }
		
        //User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false ,  { success: '0' });
        }
		
		req.login(user, function(error){
             if(error) return next(error);
			 console.log(req.user);
			 console.log(req.isAuthenticated());
             console.log("Request Login supossedly successful.");              
        });
		 
        // User and password both match, return user from 
        // done method which will be treated like success        
		return done(null, user);     		
     }
   );
}));

/*var isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated())
    return next();
  else {
	  console.log(req.isAuthenticated());
  }
  //res.redirect('/');
}*/

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var paginate = require('express-paginate');

var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.set('adminemail' , 'watermark0913@gmail.com');
app.set('view engine' , 'ejs');
app.set('captcha_secretkey' , '6LdqGSIUAAAAACWfT13RKusonYoknI1ge9-_k9qu');
app.use(cookieParser()); 
app.engine('html', require('ejs').renderFile);
app.set('trust proxy', 1)

/* app.use(session({
   secret:"dffhfdfxg",
    key: 'fxg',  
   //resave:true,
   //saveUninitialized:true
    cookie: {
        path: '/',
        domain: 'http://127.0.0.1:8081',
		httpOnly : true,  
        maxAge: 1000 * 60 * 24 // 24 hours
    }
})); */

/*app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});*/

app.get("/" , function(req, res){
    res.render('index' , {
		
	});
});

app.use(paginate.middleware(10, 50));

var urlencodedParser = bodyParser.urlencoded({extended:false});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydatabase');

var User = require('./models/UserModel')(mongoose);
var Services = require('./models/ServiceModel')(mongoose);
var Setting = require('./models/SettingModel')(mongoose);
var Category = require('./models/CategoryModel')(mongoose);
var Page = require('./models/PageModel')(mongoose);
var flash = require('connect-flash');
var bCrypt = require('bcrypt-nodejs');
app.use(flash());

/*passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    
  }
));*/

/* passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); */

var isValidPassword = function(user, password){
  //console.log(bCrypt.hashSync(password, bCrypt.genSaltSync(10), null));
  return bCrypt.compareSync(password, user.password);
}

function isAuthenticated(){
	console.log("tera");
	return function (req, res, next) {
		console.log(req.user);		
		if(req.isAuthenticated()){	
            console.log("teraagain");		
			return next();
		}
		else {
            console.log("terafailed");	 		
			res.setHeader('Content-Type', 'application/json');  
			res.send(JSON.stringify({authen:0, success:0}));
		}
	}
}

function isAdminAuthenticated(){
	console.log("mera");
	return function (req, res, next) {
        //console.log(req.user.is_admin);		
		if (req.isAuthenticated() && req.user.is_admin=='1'){			
			return next();
		}
		else {			
			res.setHeader('Content-Type', 'application/json');  
			res.send(JSON.stringify({authen:0, success:0}));
		}
	}
}

passport.isAuthenticated = isAuthenticated();

passport.isAdminAuthenticated = isAdminAuthenticated();
// passport/login.js

var validator = require('validator');

var multer = require('multer');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8081");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
var mailer = require('nodemailer');  
  
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
	},
	filename: function (req, file, cb) {
		var fileexploded = file.originalname.split(".");
		var extension = fileexploded[fileexploded.length-1];
		cb(null, file.fieldname + '-' + Date.now()+"."+extension)
	}
});

var upload = multer({storage:storage}).single('file');
var func = require("./helpers/CommonHelper.js");
var mail = require("./helpers/MailHelper.js");
var dateFormat = require('dateformat'); 
var dateDiff = require('date-diff');
var dobByAge = require('birth-by-age-at-date');
var json2csv = require('json2csv');
var excelexport = require('node-excel-export');
var pdf = require('html-pdf');
var schedule = require("node-schedule");
var slugify = require('slugify');
var fs = require('fs');
var async = require('async');	

require('./controllers/UserController')(app , func , mail, upload, storage, mailer, multer, validator, User , paginate , cors , dateFormat, dateDiff , dobByAge , json2csv , excelexport , pdf , passport , LocalStrategy, bCrypt, fs, async);

require('./controllers/ServiceController')(app , func , mail, upload, storage, mailer, multer, validator, Services , paginate , cors);

require('./controllers/SettingController')(app, func, mail, upload, storage, mailer, multer, validator, Setting, paginate, cors, dateFormat, dateDiff, dobByAge, json2csv, excelexport, pdf, passport, LocalStrategy);

require('./controllers/HomeController')(app, func, mail, mailer, multer, validator, cors, dateFormat, dateDiff, LocalStrategy, Category, Page, passport, fs, async, User);
 
require('./controllers/PageController')(app , func , mail, upload, storage, mailer, multer, validator, Page , paginate , cors , dateFormat, dateDiff , dobByAge , json2csv , excelexport , pdf , passport , LocalStrategy, bCrypt, slugify);

//require('./crons/crons')(schedule, mail, mailer, User);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'});	
});
  
// Handle 500
app.use(function(error, req, res, next) {
   //res.status(500).send('500: Internal Server Error', 500);
});

var server = app.listen(8081 , function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listing at http', host, port);
});