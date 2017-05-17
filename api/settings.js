module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, Setting, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy){ 
   
    var sess;
    var session = require('express-session'); 
    var math = require('mathjs');  		
		
    app.post("/setting/add" ,  function(req , res){
		sess=req.session;
        var resp = func.isLoggedIn(sess);
		if(!resp){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({authen:0 , success:0}));			
		}
	    else {	
			var error = [];
			var data = {};
			if(req.method=="POST"){
				 var currentdate = new Date();
				 var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');
				 for(i=0; i<req.body.settings.length; i++){
					 data = {
					   content:req.body.settings[i].content,							 
					   modified_at:formatteddate 						
					 };
										
					 console.log(data);			   
					 /*var detail = new Setting(data);
					 detail.save(function(err){
						  if(err) throw err;
						  console.log('Setting saved successfully!');
					 });*/
					 
					 Setting.findOneAndUpdate({title: req.body.settings[i].title}, data, function(err, records) {
								  if (err) throw err;				 
								  console.log('Setting saved successfully!');			 								  
					 });
					 
				 }
				 
				 res.setHeader('Content-Type', 'application/json');
				 res.send(JSON.stringify({authen:1 , success:1}));
			}
			else {
				 res.setHeader('Content-Type', 'application/json');
			     res.send(JSON.stringify({authen:1 , success:0}));			
			}
		}			
	});

    app.get("/setting/list" ,  function(req , res){
		sess=req.session;
        var resp = func.isLoggedIn(sess);
		if(!resp){
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({authen:0 , success:0}));			
		}
	    else {	
			Setting.find().exec(function(err, docs){
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({'settings':docs}));
			});
		}			
	});	
}
