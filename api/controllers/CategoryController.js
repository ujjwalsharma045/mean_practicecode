module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, Category, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy, bCrypt , fs, async, PasswordGenerate, randtoken, handlebars, UserProfile){ 
    
	var math = require('mathjs');  
	
	app.post("/category/add" , function(req , res){
		 if(req.method=="POST"){
            var condition = {
				title:req.body.title,
				parent_id:req.body.parent_id
			};
			
			Category.find(condition).count().exec(function(err , response){
				if(err)
				  throw err;
                console.log(response);			  
			    if(response>0){
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify({authen:1 , success:0 , error:'Category already exists.'}));				
				}
				else {
					var data = {
						title:req.body.title,
						parent_id:req.body.parent_id,
						description:req.body.description,
						meta_tag:req.body.meta_tag,
						meta_description:req.body.meta_description,
						status:req.body.status,
						order:req.body.order				
			        };
			
					var category = new Category(data);
					category.save(function(err , response){
						if(err)
						  throw err;
					  
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify({authen:1 , success:1}));				
					});
				}
			}); 								
		 }
		 else {
			 res.setHeader('Content-Type', 'application/json');
			 res.send(JSON.stringify({authen:1 , success:0}));
		 }
	});

    app.post("/category/edit/:id" , function(req , res){
		 if(req.method=="POST"){
            var condition = {
				title:req.body.title,
			};						
			
			Category.find(condition).exec(function(err , response){
			    if(response.length>=2){
					error = true;
					errormessage = "Category already exists.";  					   
				}
				else if(response.length>0){
					if(response[0]['_id']!=req.body.id){
					   error = true;
                       errormessage = "Category already exists.";  					   
					}
				}
				
				if(!error){
					
					var data = {
						title:req.body.title,
						parent_id:req.body.parent_id,
						description:req.body.description,
						meta_tag:req.body.meta_tag,
						meta_description:req.body.meta_description,
						status:req.body.status,
						order:req.body.order				
			        };
					
			        var findcondition = {
					   _id:req.body.id	
					};
					
					var category = new Category(data);
					Category.findOneAndUpdate(findcondition , data , function(err){
						if(err)
						  throw err;
					  
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify({authen:1 , success:1}));				
					});
				}
				else {
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify({authen:1 , success:0 , error:errormessage}));				
				}
			}); 								
		 }
		 else {
			 res.setHeader('Content-Type', 'application/json');
			 res.send(JSON.stringify({authen:1 , success:0}));
		 }
	});	
	
	app.get("/category/view/:id" , function(req , res){
		 var categoryid = req.params.id;
	     Category.findOne({_id:categoryid} , function(err , records){
		    res.setHeader('Content-Type' , 'application/json');
			console.log(records);
			res.send(JSON.stringify({authen:1 , success:1 , records:records}));
		 });
	});
	
	app.get("/category/index" , function(req , res){
         var condition = {};
         var perPage = 10;	
         var currentpage = 1;
		 
	     Category.find(condition).count().exec(function(err , totalrecords){
			 if(err)
			   throw err;				   
		     var pages = {};
			 for(i=1; i<=totalrecords; i++){
				pages[i] = i; 
			 } 
			 
             var totalPages = math.ceil(totalrecords/perPage);			 
			 Category.find(condition).limit(perPage).skip(perPage*(currentpage-1)).sort().exec(function(err , records){
				 if(err)
			      throw err;
		         res.setHeader('Content-Type', 'application/json');
			     res.send(JSON.stringify({authen:1 , success:1 , records:records , totalpages:totalPages, pages:'pages'}));
			 });
		 });
	});

	app.get("/category/list" , function(req , res){
	     Category.find().exec(function(err , records){
		   res.setHeader('Content-Type', 'application/json');
		   res.send(JSON.stringify({authen:1 , success:1 , records:records}));	
	     });
	});
	
	app.delete("/category/remove/:id" , function(req , res){
		 var categoryid = req.params.id
	     Category.findOneAndRemove({_id:categoryid}, function(err){
		      if(err)
				throw err;
			  res.setHeader('Content-Type', 'application/json');
		      res.send(JSON.stringify({authen:1 , success:1}));	
	     });
	});
}