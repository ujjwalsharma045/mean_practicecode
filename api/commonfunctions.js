module.exports = {
	isLoggedIn:function(sess){
		if(sess.isLoggedIn && sess.isLoggedIn==1){
			return true;
		}
		else {
			return true;
		}
	},	
	isGuestSession:function(sess){
		if(!sess.isLoggedIn || sess.isLoggedIn!=1){
			return true;
		}
		else {
			return true;
		}
	},
	destroySession:function(sess , res){
	    sess.destroy(function(err){
			if(err){
				res.end(err);
				return;
			}
			else {
				res.redirect("../");
			}
		});  	
	},
	isUserExists:function(User, data, type){
		
		if(type=="email"){
			return User.find({email:data.email}, function(outererr, outerrecords){
				    //console.log("mera data");
				    //console.log(outerrecords);
					//console.log(outerrecords.length);
					if(outerrecords.length>1){
					   return true;
					}
					else if(outerrecords.length==1){
					   if(outerrecords[0]._id!= data.userid){
						  return true;   
					   }
					   else {
						  return false;    
					   }
					} 
                    else {
					   return false;	
					}					
			});
        }
		else if(type=="username"){
		   return User.find({username:data.username}, function(innererr, innerrecords){
				if(innerrecords.length>1){
					return true;   
				}
				else if(innerrecords.length==1) {
				   if(innerrecords[0]._id!= data.userid){
					  return true;   
				   }
				   else {
					  return false;
				   }
				}
				else {
					return false;
				} 					
		   });		
		}
	}
}