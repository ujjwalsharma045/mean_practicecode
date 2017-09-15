module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, Category, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy, bCrypt , fs, async, PasswordGenerate, randtoken, handlebars){ 
    	
	app.get("/common/getstatus" , function(req , res){
		 var statusdetail = [
		     {
			   'id':'A',
			   'title':'Active'
			 },
			 {
			   'id':'I',
			   'title':'Inactive'
			 }
		 ];
         res.setHeader('Content-Type', 'application/json');
		 res.send(JSON.stringify({authen:1 , success:1 , status:statusdetail}));					     
	});
}