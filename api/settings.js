module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, Setting, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy){ 
   
    var sess;
    var session = require('express-session'); 
    var math = require('mathjs');
    var async = require('async');	
	
    app.post("/setting/add" , passport.isAuthenticated,  function(req , res){		
			var error = [];
			var data = [];
			if(req.method=="POST"){
				 var currentdate = new Date();
				 var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');
				 
				 async.forEachSeries(req.body.settings , function(setting , callback){
				        
					   data = {
					     content:setting.content,							 
					     modified_at:formatteddate 						
					   };
					   
					   //console.log(data);
					   
				       Setting.find({title:setting.title}, function(err, records){
					      if(err) throw err; 
						  if(records.length>0){ 
                              console.log(data);						  
							  Setting.findOneAndUpdate({title: records[0].title}, data, function(err, records) {
						         if (err) throw err;				 
						         console.log('Setting saved successfully!');
								 callback();
					          });
						  }
                          else {
							  data.title = setting.title;
							  var detail = new Setting(data);
							  detail.save(function(err){
								  if(err) throw err;
								  console.log('Setting saved successfully!');
								  callback();
							  });
						  }	
					   });				 
				 }, function(){
					 
				 });
				 			     				 
				 res.setHeader('Content-Type', 'application/json');
				 res.send(JSON.stringify({authen:1 , success:1}));
			}
			else {
				 res.setHeader('Content-Type', 'application/json');
			     res.send(JSON.stringify({authen:1 , success:0}));			
			}				
	});

    app.get("/setting/list" , passport.isAuthenticated, function(req , res){
		
			Setting.find().exec(function(err, docs){
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({'settings':docs, 'authen':1, 'success':1}));
			});					
	});	
}
