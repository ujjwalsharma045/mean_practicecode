module.exports = function(app, func, mail, mailer, multer, validator, cors, dateFormat, dateDiff,LocalStrategy, Category, Page, passport, fs, async, User, handlebars){ 
    
    var sess;
    var session = require('express-session'); 
	
	var request = require('request');
    var readHTMLFile = function(path, callback) {
		fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
			if (err) {
				throw err;
				callback(err);
			}
			else {
				callback(null, html); 
			}
		});
    };
		
	app.get("/home/index" , homepage);
	app.get("/home" , homepage);
	
	app.get("/home/page/:slug" , pages);
	
    app.all("/home/contactus" , function(req, res){
	    sess=req.session;
        var resp = func.isLoggedIn(sess);
        if(!resp){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({authen:0 , success:0}));
		}
        else {
			if(req.method=="POST"){ console.log(req.body.recaptcharesponse);
				if(req.body.recaptcharesponse==="undefined" || req.body.recaptcharesponse==='' || req.body.recaptcharesponse=== null){
					 res.setHeader('Content-Type', 'application/json');
				     res.send(JSON.stringify({authen:1 , success:2}));
				} 
				else {
					secretKey = app.get('captcha_secretkey');
					
					var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptcharesponse + "&remoteip=" + req.connection.remoteAddress;
					
					request(verificationUrl,function(error,response,body) {
						body = JSON.parse(body);
						console.log(response);
						console.log(error);
						console.log(body);
					    if(body.success !== undefined && !body.success) {                           
						   res.setHeader('Content-Type', 'application/json');
				           res.send(JSON.stringify({authen:1 , success:4}));
                        }
						else {
							mailOptions = {
					           to:app.get('adminemail'),
					           subject:'Query',
					           text:'dsd',
				            };
			
							readHTMLFile(__dirname + '/public/views/emails/index.html', function(err, html){
									var template = handlebars.compile(html);
									var replacements = {
										 name: req.body.name,
										 email: req.body.email,
										 content: req.body.content
									};
									var htmlToSend = template(replacements);
									var mailOptions = {
										//from: 'my@email.com',
										to : app.get('adminemail'),
										subject : 'test subject',
										html : htmlToSend
									};
									 
									var mailObj = mail.configMail(mailer);
									mailObj.sendMail(mailOptions , function(error , response){
										if(error){
											console.log(error);
										}
										else {
											console.log(response);
										}        				
									});		
							});
							
					        res.setHeader('Content-Type', 'application/json');
				            res.send(JSON.stringify({authen:1 , success:1}));
						}
					});
				}
												
				/*var mailObj = mail.configMail(mailer);
				mailObj.sendMail(mailOptions , function(error , response){
                    if(error){
						console.log(error);
					}
                    else {
						console.log(response);
					}        				
                }); */
								
			}
			else {
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({authen:1 , success:0}));
			}
		}		
	});  

	function homepage(req , res){
		sess=req.session;
        var resp = func.isLoggedIn(sess);
		if(!resp){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({authen:0 , success:0}));			
		}
	    else {
			Category.find().exec(function(err, docs){
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({'records':docs , success:1}));
			});
		}
	}

    function pages(req , res){		   
		Page.find({slug:req.params.slug} , function(err, doc){ console.log(doc);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({'record':doc , success:1}));
		});		
	}

    app.get("/home/summary", passport.isAdminAuthenticated, function(req, res){
	    async.parallel([
			   function(cb){
				   User.find({}, cb);
			   },
			   function(cb){
				   Page.find({}, cb);
			   }
		  ], function(err, results){				 
			 var records = {
				 totalusers:results[0].length,
                 totalpages:results[1].length				 
			 };
			 
			 res.setHeader('Content-Type', 'application/json');
			 res.send(JSON.stringify({'success':1, 'authen':1, 'records':records}));
	    });				
	});	
}