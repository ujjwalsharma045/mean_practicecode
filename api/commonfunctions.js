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
	}
}