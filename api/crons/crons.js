module.exports = function(schedule, mail, mailer, User){ 
   var rule = new schedule.RecurrenceRule();
   //rule.minute = 40;
   rule.second = 2;
   
   schedule.scheduleJob(rule, function(){
	
		var data = {
			email:{ "$regex": 'gmail', "$options": "i" }		
		};
	
		User.find(data , function(err, records){
			if(err) throw err;
			var mailObj = mail.configMail(mailer);
			for(i=0; i<records.length; i++){
				  console.log(records[i].email);
				  mailoptions = {
					to:records[i].email,
					subject: "User Activation",
					text:"User Activated successfully"
				  };
				 
				  mailObj.sendMail(mailoptions, function(error , response){
					  if(error){
						  console.log(error);
					  }
					  else {
						  console.log(response.message); 
					  }
				  });
			} 				
		});	    
   });

   rule.second = 5;
   schedule.scheduleJob(rule, function(){
	
		var data = {
			email:{ "$regex": 'ujjwal', "$options": "i" }		
		};
	
		User.find(data , function(err, records){
			if(err) throw err;
			var mailObj = mail.configMail(mailer);
			for(i=0; i<records.length; i++){ 
				  console.log(records[i].email);
				  mailoptions = {
					to:records[i].email,
					subject: "User Activation for specific user",
					text:"Specific User Activated successfully"
				  };
				 
				 /* mailObj.sendMail(mailoptions, function(error , response){
					  if(error){
						  console.log(error);
					  }
					  else {
						  console.log(response.message); 
					  }
				  });*/
			} 				
		});	    
   });   
}
