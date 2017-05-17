var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var paginate = require('express-paginate');

var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.set('adminemail' , 'watermark0913@gmail.com');
app.set('view engine' , 'ejs');
app.use(cookieParser()); 
app.engine('html', require('ejs').renderFile);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

app.use(session({
  secret: 'fhtfryh',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true, originalMaxAge:900000, domain: 'http://127.0.0.1:8081',  path: '/', maxAge: 1000 * 60 * 24 }
}));

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

var User = require('./models/user')(mongoose);
var Services = require('./models/service')(mongoose);
var Setting = require('./models/setting')(mongoose);

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

var func = require("./commonfunctions.js");

var mail = require("./mailfunctions.js");

var dateFormat = require('dateformat'); 

var dateDiff = require('date-diff');
var dobByAge = require('birth-by-age-at-date');

var json2csv = require('json2csv');
var excelexport = require('node-excel-export');
var pdf = require('html-pdf');
var schedule = require("node-schedule");
require('./user')(app , func , mail, upload, storage, mailer, multer, validator, User , paginate , cors , dateFormat, dateDiff , dobByAge , json2csv , excelexport , pdf , passport , LocalStrategy);

require('./services')(app , func , mail, upload, storage, mailer, multer, validator, Services , paginate , cors);

require('./settings')(app , func , mail, upload, storage, mailer, multer, validator, Setting , paginate , cors , dateFormat, dateDiff , dobByAge , json2csv , excelexport , pdf , passport , LocalStrategy);

require('./crons')(schedule, mail, mailer, User);


var server = app.listen(8081 , function(){
    var host = server.address().address;
    var port = server.address().port;
   
    console.log('App listing at http' , host, port);
});


