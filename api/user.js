module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, User, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy, isAuthenticated){ 
    
    var sess;
    //var session = require('express-session'); 
    var math = require('mathjs');  		
	
	app.get("/showusers", passport.isAdminAuthenticated, function(req, res){
		
			var data = {
				
			};
				
			if(req.query.email){			
				//var regex = new RegExp(req.query.email, "i")				
				data.email = { "$regex": req.query.email, "$options": "i" } ;
			}
			
			if(req.query.username){			
				data.username = { "$regex": req.query.username, "$options": "i" };
			}
			
			if(req.query.first_name){ 					    
				data.first_name = { "$regex": req.query.first_name, "$options": "i" };
			}
			
			if(req.query.last_name){					    
				data.last_name = { "$regex": req.query.last_name, "$options": "i" };
			}
			
			if(req.query.age){					    
			    var dob = dobByAge(req.query.age , new Date());
				
				//console.log("ss"+dob.upperYear);
				
				var dt = new Date();
				
				//console.log(new Date().getMonth());
				//console.log(new Date().getDate());
				//console.log(new Date().getFullYear());
				
				var newdate = new Date(dob.upperYear, dt.getMonth(), dt.getDate());
				//console.log(newdate);
				
				var formateddob = dateFormat(newdate ,'yyyy-mm-dd');
				//var formateddob = dateFormat(dob ,'yyyy-mm-dd');
				
				//console.log(formateddob);
				
				//data.dateofbirth = formateddob;
				data.dateofbirth = { "$lte": formateddob };
			};
						
			var sortsection = {
				
			};
			
			//console.log(req.query);
			
			if(req.query.sortfield){				
                if(!req.query.sorttype){
                   req.query.sorttype = 'asc';
				}
				
				if(req.query.sortfield=="first_name")					
			       sortsection.first_name = req.query.sorttype; 
				else if(req.query.sortfield=="last_name")					
			       sortsection.last_name = req.query.sorttype; 
				else if(req.query.sortfield=="email")					
			       sortsection.email = req.query.sorttype; 
				else if(req.query.sortfield=="username")					
			       sortsection.username = req.query.sorttype; 
			    else if(req.query.sortfield=="dateofbirth")					
			       sortsection.dateofbirth = req.query.sorttype; 
			}
			else { 
				sortsection.email = 'asc'; 	
			}
			
			//console.log(sortsection);	
            page = (req.query.page && req.query.page>0)? req.query.page:1;			
            perPage = (req.query.limit && req.query.limit>0)? req.query.limit:5; 			
			User.find(data).count().exec(function(err, count){
				  var totalPages = math.ceil(count/perPage);
				  //console.log(totalPages);
				  
				  var pages = {};
				  for(var i=1; i<=totalPages; i++){
					  pages[i] = i;
				  }
				  
				  //console.log(pages);
			      User.find(data).limit(perPage).skip(perPage * (page-1)).sort(sortsection).exec(function(err, docs){
				      //console.log(docs);			   
				      res.setHeader('Content-Type', 'application/json');
				      res.send(JSON.stringify({'records':docs , 'totalrecords':count , 'totalpages':totalPages , 'pages':pages, 'success':1, 'authen':1}));
				  });	
			});						
	    
	});

	app.delete("/delete/:id", passport.isAdminAuthenticated, function(req, res){
		var userid = req.params.id; 
		User.findOneAndRemove({_id: userid}, function(err) {
			if (err) throw err;     
			res.setHeader('Content-Type', 'application/json');	
			res.send(JSON.stringify({'authen':1 , 'success':1}));			
			console.log('User successfully deleted!');						
		});		
	});

	app.get("/view/:id", passport.isAdminAuthenticated, function(req, res){
		var userid = req.params.id;
		User.find({_id:userid}, function(err, records) {
			  if (err) throw err;
			  console.log(records); 
			  res.setHeader('Content-Type', 'application/json');
			  res.send(JSON.stringify({'records':records, 'success':1, 'authen':1}));
		}); 		
	});

    app.post("/edit/:id", passport.isAdminAuthenticated,  function(req, res){			    	
			var userid = req.params.id; 
			var error = [];	
			var data = {};
			var recor = [];				
				
			if(req.method=="POST"){
				if(error.length <=0){
					upload(req, res, function(err){
						 if(req.file){ 
							   if(err){
								  res.json({error_code:1,err_desc:err});
								  return;
							   }
							   
					           var currentdate = new Date();
                               var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');
					  
							   data = {
									first_name: req.body.first_name,
									last_name:req.body.last_name,
									address:req.body.address,
									city:req.body.city,
									state:req.body.state,
									zipcode:req.body.zipcode,
									dateofbirth:req.body.dateofbirth,
									profile_pic:req.file.filename,
									modified_at:formatteddate
							   }; 
					  
							   console.log(data);
							   User.findOneAndUpdate({_id: userid}, data, function(err, records) {
								  if (err) throw err;				 
											 
								  res.setHeader('Content-Type', 'application/json');
								  res.send(JSON.stringify({authen:1 ,success:1}));
							  });
						 }
                         else {
							   var currentdate = new Date();
                               var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');
					  
							   data = {
									first_name: req.body.first_name,
									last_name:req.body.last_name,
									address:req.body.address,
									city:req.body.city,
									state:req.body.state,
									zipcode:req.body.zipcode,
									dateofbirth:req.body.dateofbirth,	
									modified_at:formatteddate
							   }; 
					  
							   console.log(data);
							   User.findOneAndUpdate({_id: userid}, data, function(err, records) {
								  if (err) throw err;				 
											 
								  res.setHeader('Content-Type', 'application/json');
								  res.send(JSON.stringify({authen:1 ,success:1}));
							  });
						  }						 
				     }); 		 		 	
			    }
                else {
				   res.setHeader('Content-Type', 'application/json');
				   res.send(JSON.stringify({authen:1 ,success:0}));
			    }			
		    }
		
	});
	
	app.get("/checklogin", passport.isAdminAuthenticated, function(req, res){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({authen:1 ,success:1}));						
	});

    app.post("/adduser", passport.isAdminAuthenticated,  function(req , res){			
			var error = [];
			var data = {};
			if(req.method=="POST"){
				 if(error.length<=0){                   
				    upload(req, res, function(err){
						 if(req.file){ 
							   if(err){
								  res.json({error_code:1,err_desc:err});
								  return;
							   }
						
                               //res.json({error_code:0,err_desc:null});
                   				   
                               var currentdate = new Date();
                               var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');				   
					           data = {
									 first_name:req.body.first_name,
									 last_name:req.body.last_name,
									 email:req.body.email,
									 username:req.body.username,
									 password:req.body.password,
									 profile_pic:req.file.filename,
									 dateofbirth:req.body.dateofbirth,
									 created_at :formatteddate 						
					          };
						 }
						 else {
                             var currentdate = new Date();
                             var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');				   
					         data = {
								 first_name:req.body.first_name,
								 last_name:req.body.last_name,
								 email:req.body.email,
								 username:req.body.username,
								 password:req.body.password,
								 profile_pic:'',
								 dateofbirth:req.body.dateofbirth,
								 created_at :formatteddate 						
					        };
                        }
						
					    console.log(data);			   
						var detail = new User(data);
						detail.save(function(err){
							  if(err) throw err;
							  console.log('User saved successfully!');
						   
							   mailoptions = {
								  to:data.email,
								  subject: "User Registration",
								  text:"User Registered successfully"
							   };
						   
							   var mailObj = mail.configMail(mailer);
							  
							   mailObj.sendMail(mailoptions, function(error , response){
								  if(error){
									  console.log(error);
								  }
								  else {
									  console.log(response.message); 
								  }
							   }); 
							   res.setHeader('Content-Type', 'application/json');
							   res.send(JSON.stringify({authen:1 , success:1})); 				   
						});			   			    
				    });
				 } 
			}
			else {
				res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify({authen:1 , success:0}));			
			}				
	});
	
	app.post('/login',  function(req, res, next){
		 //console.log(req);	
		 
		 passport.authenticate('login', function(err, user, info) {
              if(err){ 
			     return next(err); 
			  }
			  
              if(!user){ 
			      res.setHeader('Content-Type', 'application/json');
		          res.send(JSON.stringify({authen:0, success:0})); 
			  }
			  else {
				  req.login(user, function(err) {
					 if(err){ return next(err); }
					 res.setHeader('Content-Type', 'application/json');
					 if(req.user.is_admin==1){
					   res.send(JSON.stringify({authen:1, success:1, usertype:'admin'}));
					 }
					 else {
					   res.send(JSON.stringify({authen:1, success:1, usertype:'user'}));	 
					 }
				  });
			  }
         })(req, res, next);
        //res.setHeader('Content-Type', 'application/json');
		//res.send(JSON.stringify({authen:1, success:1}));
    });
		
	/* app.post("/login", function(req , res){
        sess = req.session;       
        var resp = func.isGuestSession(sess);
		if(!resp){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({authen:1 , success:0}));			
		}
	    else { 		 
			var error = [];		
			if(req.method=="POST"){
				console.log(req.body.username);
				var data = {
					username:req.body.username,
					password:req.body.password
				}
				
				if(error.length<=0){									
					User.find(data, function(err, user) {
						  if (err) throw err;
						  console.log(user);    
						  if(user.length>0){	
				               sess.isLoggedIn = 1;
							   sess.userid=user[0]._id;
							   sess.save();
							   var detail = {
								   maxAge:900000,
								   httpOnly:true
							   };
							   console.log(sess); 
							   res.cookie('user' , user._id , detail);
							   //console.log(res); 
							   res.setHeader('Content-Type', 'application/json');
							   res.send(JSON.stringify({success:1 , authen:1})); 				   
						  }
						  else {						  
							   res.setHeader('Content-Type', 'application/json');
							   res.send(JSON.stringify({success:0 , error:'Either username or password is incorrect.' , authen:0}));
						  }					      		  
					});  				
				}
				else  {
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify({success:4 , error:'Invalid Request' , authen:0 }));
				} 
			}
			else {
				 res.setHeader('Content-Type', 'application/json');
				 res.send(JSON.stringify({success:2 , error:'Invalid Request' , authen:0 }));
			}		
		}
	}); */

    /*app.post("/login",  function(req , res, next){
        sess = req.session;       
		passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
               if(!user) {
                 res.setHeader('Content-Type', 'application/json');
		         res.send(JSON.stringify({success:1 , authen:0 }));				   			     
			   }
			   req.logIn(user, function(err) {
			    if (err) { return next(err); }
			     res.setHeader('Content-Type', 'application/json');
		         res.send(JSON.stringify({success:1 , authen:0 }));
			   });
           })(req, res, next);
           
	});*/	

    app.get('/exportusers', passport.isAdminAuthenticated, function(req , res){
         User.find({} , function(err, records){
	         if(err) 
				throw err;
             
			 var fields = ['first_name', 'last_name', 'email', 'username', 'address', 'city' , 'state', 'zipcode', 'dateofbirth'];
			 
             var fieldNames = ['FirstName', 'LastName', 'Email', 'Username', 'Address', 'City', 'State', 'Zipcode', 'DateofBirth'];
			 
             var data = json2csv({data:records, fields: fields, fieldNames: fieldNames });
			 
			 res.attachment('users.csv');
             res.status(200).send(data);			 
		 });	
	});

    app.get('/exportxlsusers', passport.isAdminAuthenticated, function(req , res){
         User.find({} , '_id first_name last_name username email address city state zipcode dateofbirth',  function(err, records){
	         if(err) 
				throw err;
             console.log(records);	
			 
			 var styles = {
			   headerDark: {
					fill: {
					  fgColor: {
						rgb: 'FF000000'
					  }
					},
					font: {
					  color: {
						rgb: 'FFFFFFFF'
					  },
					  sz: 14,
					  bold: true,
					  underline: true
					}
			   },
			   cellPink: {
					fill: {
					  fgColor: {
						rgb: 'FFFFFF'
					  }
					}
			   },
			   cellGreen: {
					fill: {
					  fgColor: {
						rgb: 'FF00FF00'
					  }
					}
			   }
			};

             let heading = [
               [
			      {value: 'ID', style: styles.headerDark}, 
			      {value: 'FirstName', style: styles.headerDark}, 
			      {value: 'LastName', style: styles.headerDark},
				  {value: 'UserName', style: styles.headerDark},
                  {value: 'Email', style: styles.headerDark},				  
				  {value: 'Address',  style: styles.headerDark},
				  {value: 'City', style: styles.headerDark},
				  {value: 'State', style: styles.headerDark},
				  {value: 'Zipcode', style: styles.headerDark},
				  {value: 'DateofBirth', style: styles.headerDark}
			   ]
               
             ];
			 
			 var specification = {
				  _id: { 
					   displayName: 'ID', 
					   headerStyle: styles.headerDark, 
					   cellStyle: styles.cellPink,
					   width: 120 
				  },
				  first_name: { 
					   displayName: 'FirstName',  
					   headerStyle: styles.headerDark, 
					   cellStyle: styles.cellPink,
					   width: 120 
				  },			  
				  last_name: {
					   displayName: 'LastName',
					   headerStyle: styles.headerDark,
					   cellFormat: styles.cellPink,
					   width: 140 
				  },
				  username: {
					   displayName: 'UserName',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  email: {
					   displayName: 'Email',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  address: {
					   displayName: 'Address',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  city: {
					   displayName: 'City',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  state: {
					   displayName: 'State',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  zipcode: {
					   displayName: 'Zipcode',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  },
				  dateofbirth: {
					   displayName: 'Dateofbirth',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  }
             };

             var data = excel.buildExport([{
				  name:'users',
				  //heading:heading,
				  specification:specification,
				  data:records				 
			 }]);
			 
			 res.attachment('users.xlsx');
             return res.status(200).send(data);			 
		 });	
	});	
	
	app.get('/exportpdfusers', function(req , res){
		var options = {format: 'Letter'};
		
		var info = {
			 "Company": "ABC",
			 "Team": "JsonNode",
			 "Number of members": 4,
			"Time to finish": "1 day"
		}
		
		res.render('views/users/users', {
			info: info,
		}, function (err, HTML){
			pdf.create(HTML, options).toFile('./downloads/employee.pdf', function (err, result){
				if(err){
					console.log(err);
					return res.status(400).send({
						//message: errorHandler.getErrorMessage(err)
					});
				}
			})
		 });	     							
    });
	
	app.delete("/removemultiple", passport.isAdminAuthenticated, function(req, res){
		var ids = req.query.ids; 
		var myarr = ids.split(",");  
		
		for(var i=0; i<myarr.length; i++){
			if(myarr[i]!=""){
				console.log(myarr[i]);
				User.findOneAndRemove({_id: myarr[i]}, function(err) {
					if (err) throw err;     					
					console.log('User successfully deleted!');						
				});	
			}
		}
		res.setHeader('Content-Type', 'application/json');	
		res.send(JSON.stringify({authen:1 , success:1}));							    
	});

    app.get('/totalusers', passport.isAdminAuthenticated, function(req, res){
		User.find().count().exec(function(err, count){
			if(err)
			  throw err;
		    res.setHeader('Content-Type', 'application/json');	
			res.send(JSON.stringify({users:count , success:1 , authen:1}));						
		});
	}); 

    app.get("/viewhtml/:id",  passport.isAdminAuthenticated, function(req, res){            		     	
		var userid = req.params.id;
		User.find({_id:userid}, function(err, records) {
			  if (err) throw err;
			  console.log(records); 				  
			  res.render('users/views', {
				  records:records,
                  success:1,
                  authen:1				  
			  });
		}); 				
	});
	
	app.post("/logout", function(req, res){
        req.logout();
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({authen:0 ,success:1}));						
	});
	
}
