app.controller('front' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', '$state', '$stateParams', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Users, pageTitle, Upload, $timeout, $state, $stateParams){
      	   
    var storageType = localStorageService.getStorageType();
    $scope.adminloggedin = false;
	$scope.loggedin = false;
	
    if(localStorageService.get('login')=="1"){
       if(localStorageService.get('usertype')=="admin"){       	
          $scope.adminloggedin = true;
		  $scope.loggedin = true;
	   }
	   else if(localStorageService.get('usertype')=="user"){
		   $scope.loggedin = true;
	   }
	}
        
   
    $scope.content = "";   
    $scope.timeformat = dateTime.showTime();     
    $scope.title = pageTitle;
                                                   
    $scope.logout = function(){
	       
	   var req = {
			method: 'POST',
			url: 'logout',
			headers: {
			  'Content-Type': 'application/json'
			}
	   };
       
	   $http(req).then(
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
}]);


