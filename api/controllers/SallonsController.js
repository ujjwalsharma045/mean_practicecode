module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, User, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy, bCrypt , fs, async, PasswordGenerate, randtoken, handlebars){ 
       
	app.get("/sallon/:slug", function(req, res){					
	
		var data = {
			slug:'tamma'
		};	
		
		SallonImages.findOne(data).populate('sallons').exec(function(err, records){	
		    res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({'success':1 , 'authen':0 , 'records':records}));				  
		});							    
	});
}