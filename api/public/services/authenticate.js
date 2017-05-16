app.factory('authenticate' ,['$http', function($http){
	var cmtainer = {};
	var data;
	cmtainer.authic = function(){  		
		$http.get('api/checkusers.php').then(function(response){            
			data = response.data;
		});
		return data;
	}
	return cmtainer;
}]);

app.service('authen' ,function(authenticate){
	this.authenticacy =function(){
	   return authenticate.authic();
	}
});