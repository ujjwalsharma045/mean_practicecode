app.factory('dateTime' , function(){		
	var dt = {};
	dt.showTime = function(){		
		var dt = new Date();
		return dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
	}		
    return dt;	
});

app.factory('Users' , function($http){	
    var user = {};		
	user.totalUsers = function ($scope){         
		return $http.get('http://127.0.0.1:8081/totalusers').then(function(response){
		    $scope.totalusers  = response.data['users'];
		});	
    }
	
    return user;	
});

app.factory('Pages' , function($http){	
    var page = {};		
	page.totalPages = function ($scope){         
		return $http.get('http://127.0.0.1:8081/page/total').then(function(response){
		    $scope.totalpages  = response.data['pages'];
		});	
    }
	
    return page;	
});
