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
		return $http.get('http://localhost:8081/totalusers').then(function(response){
		    $scope.totalusers  = response.data['users'];
		});	
    };
	
	user.logOut = function ($scope, $location, localStorageService){         
		var req = {
			method: 'POST',
			url: 'logout',
			headers: {
			  'Content-Type': 'application/json'
			}
	    };

	    return $http(req).then(
		   function(response){
			 console.log(response);
			 if(response.data['success']=='1'){
				 localStorageService.remove('login');
				 $location.path("/login");
			 }
		   },
		   function(response){	      
			
		   }
	    );	
    }
	
    return user;	
});

app.factory('Pages' , function($http){	
    var page = {};		
	page.totalPages = function ($scope){         
		return $http.get('http://localhost:8081/page/total').then(function(response){
		    $scope.totalpages  = response.data['pages'];
		});	
    }
	
    return page;	
});

app.factory('Category' , function($http){	
    var category = {
		list:function($scope){
		   return $http.get('http://localhost:8081/category/list').then(function(response){
		      $scope.categorydetail  = response.data['records'];
		   });	
		}
	};
	
    return category;	
});

app.factory('Status' , function($http){	
    var statusobjc = {
		statusdetail:function($scope){
		   return $http.get('http://localhost:8081/common/getstatus').then(function(response){
		        $scope.statusarr  = response.data['status'];
		   });	
		}
	};
	
    return statusobjc;	
});
