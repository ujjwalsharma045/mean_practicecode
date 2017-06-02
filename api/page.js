module.exports = function(app , func , mail, upload, storage, mailer, multer, validator, Page, paginate , cors , dateFormat , dateDiff, dobByAge, json2csv, excel , pdf, passport , LocalStrategy, bCrypt ,slugify){ 
    
    var sess;
    //var session = require('express-session'); 
    var math = require('mathjs');  		
	var async = require('async');
	
	app.get("/page/index", passport.isAdminAuthenticated, function(req, res){
		    console.log("start call"); 
			var data = {
				
			};
				
			if(req.query.title){			
				//var regex = new RegExp(req.query.email, "i")				
				data.title = { "$regex": req.query.title, "$options": "i" } ;
			}
			
			if(req.query.content){			
				data.content = { "$regex": req.query.content, "$options": "i" };
			}
			
			if(req.query.status){ 					    
				data.status = req.query.status;
			}
							
			var sortsection = {
				
			};
			
			//console.log(req.query);
			
			if(req.query.sortfield){				
                if(!req.query.sorttype){
                   req.query.sorttype = 'asc';
				}
				
				if(req.query.sortfield=="id")
				   sortsection._id = req.query.sorttype; 	
				else if(req.query.sortfield=="title")					
			       sortsection.title = req.query.sorttype; 
				else if(req.query.sortfield=="status")					
			       sortsection.status = req.query.sorttype; 				
			}
			else { 
				sortsection._id = 'asc'; 	
			}
			
			//console.log(sortsection);	
            page = (req.query.page && req.query.page>0)? req.query.page:1;			
            perPage = (req.query.limit && req.query.limit>0)? req.query.limit:5; 			
			Page.find(data).count().exec(function(err, count){
				  var totalPages = math.ceil(count/perPage);
				  //console.log(totalPages);
				  
				  var pages = {};
				  for(var i=1; i<=totalPages; i++){
					  pages[i] = i;
				  }
				  
				  //console.log(pages);
			      Page.find(data).limit(perPage).skip(perPage * (page-1)).sort(sortsection).exec(function(err, docs){
				      //console.log(docs);			   
				      res.setHeader('Content-Type', 'application/json');
				      res.send(JSON.stringify({'records':docs , 'totalrecords':count , 'totalpages':totalPages , 'pages':pages, 'success':1, 'authen':1}));
				  });	
			});						
	    
	});

	app.delete("/page/delete/:id", passport.isAdminAuthenticated, function(req, res){
		var pageid = req.params.id; 
		Page.findOneAndRemove({_id: pageid}, function(err) {
			if (err) throw err;     
			res.setHeader('Content-Type', 'application/json');	
			res.send(JSON.stringify({'authen':1 , 'success':1}));			
			console.log('Page successfully deleted!');						
		});		
	});

	app.get("/page/view/:id", passport.isAdminAuthenticated, function(req, res){
		var pageid = req.params.id;
		Page.find({_id:pageid}, function(err, records) {
			  if (err) throw err;
			  console.log(records); 
			  res.setHeader('Content-Type', 'application/json');
			  res.send(JSON.stringify({'records':records, 'success':1, 'authen':1}));
		}); 		
	});

    app.post("/page/edit/:id", passport.isAdminAuthenticated,  function(req, res){			    	
			var pageid = req.params.id; 
			var error = [];	
			var data = {};
			var recor = [];				
							
			if(error.length <=0){
				   var currentdate = new Date();
				   var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');
		  
				   data = {
						title: req.body.title,
						slug:slugify(req.body.title),
						content:req.body.content,								
						modified_at:formatteddate,
						status:req.body.status
				   }; 
		  
				   console.log(data);
				   Page.findOneAndUpdate({_id: pageid}, data, function(err, records) {
					  if (err) throw err;				 
								 
					  res.setHeader('Content-Type', 'application/json');
					  res.send(JSON.stringify({authen:1 ,success:1}));
				   });						  									      	 		 
			}
			else {
				  res.setHeader('Content-Type', 'application/json');
				  res.send(JSON.stringify({authen:1 ,success:0}));
			}					    		
	});
	
    app.post("/page/add", passport.isAdminAuthenticated,  function(req , res){			
			var error = [];
			var data = {};
			
			if(error.length<=0){                   								
				var currentdate = new Date();
				var formatteddate = dateFormat(currentdate ,'yyyy-mm-dd HH:MM:ss');				   
				data = {
					 title:req.body.title,
					 slug:slugify(req.body.title),
					 content:req.body.content,							 
					 created_at :formatteddate,
                     status:req.body.status					 
				};
											
				console.log(data);			   
				var detail = new Page(data);
				detail.save(function(err){
					  if(err) throw err;
					  console.log('Page saved successfully!');
					  res.setHeader('Content-Type', 'application/json');
					  res.send(JSON.stringify({authen:1 , success:1})); 				   
				});			   			    				    
			}
			else {					
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify({authen:1 ,success:0}));			    
			}						
	});
		
    app.get('/page/exportcsv', passport.isAdminAuthenticated, function(req , res){
         Page.find({} , function(err, records){
	         if(err) 
				throw err;
             
			 var fields = ['_id', 'title', 'content', 'status'];
			 
             var fieldNames = ['ID', 'Title', 'Content', 'Status'];
			 
             var data = json2csv({data:records, fields: fields, fieldNames: fieldNames });
			 
			 res.attachment('pages.csv');
             res.status(200).send(data);			 
		 });	
	});

    app.get('/page/exportxls', passport.isAdminAuthenticated, function(req , res){
         Page.find({} , '_id title content status',  function(err, records){
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
			      {value: 'Title', style: styles.headerDark}, 
			      {value: 'Content', style: styles.headerDark},
				  {value: 'Status', style: styles.headerDark}                  
			   ]              
             ];
			 
			 var specification = {
				  _id: { 
					   displayName: 'ID', 
					   headerStyle: styles.headerDark, 
					   cellStyle: styles.cellPink,
					   width: 120 
				  },
				  title: { 
					   displayName: 'Title',  
					   headerStyle: styles.headerDark, 
					   cellStyle: styles.cellPink,
					   width: 120 
				  },			  
				  content: {
					   displayName: 'Content',
					   headerStyle: styles.headerDark,
					   cellFormat: styles.cellPink,
					   width: 140 
				  },
				  status: {
					   displayName: 'Status',
					   headerStyle: styles.headerDark,
					   cellStyle: styles.cellPink, 
					   width: 220 
				  }				  
             };

             var data = excel.buildExport([{
				  name:'pages',
				  //heading:heading,
				  specification:specification,
				  data:records				 
			 }]);
			 
			 res.attachment('pages.xlsx');
             return res.status(200).send(data);			 
		 });	
	});	
		
	app.delete("/page/removemultiple", passport.isAdminAuthenticated, function(req, res){
		var ids = req.query.ids; 
		var myarr = ids.split(",");  
		
		for(var i=0; i<myarr.length; i++){
			if(myarr[i]!=""){
				console.log(myarr[i]);
				Page.findOneAndRemove({_id: myarr[i]}, function(err) {
					if (err) throw err;     					
					console.log('User successfully deleted!');						
				});	
			}
		}
		
		res.setHeader('Content-Type', 'application/json');	
		res.send(JSON.stringify({authen:1 , success:1}));							    
	});

    app.get('/page/total', passport.isAdminAuthenticated, function(req, res){
		Page.find().count().exec(function(err, count){
			if(err)
			  throw err;
		    res.setHeader('Content-Type', 'application/json');	
			res.send(JSON.stringify({pages:count , success:1 , authen:1}));						
		});
	}); 

    app.get("/page/viewhtml/:id",  passport.isAdminAuthenticated, function(req, res){     
	    var pageid = req.params.id;
		Page.find({_id:pageid}, function(err, records) {
			  if (err) throw err;
			  console.log(records); 				  
			  res.render('page/views', {
				  records:records,
                  success:1,
                  authen:1				  
			  });
		});       		     			 			
	});	
}