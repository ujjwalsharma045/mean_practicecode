app.controller('setting' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', function($scope , $http , $route , $routeParams ,$location , authen, localStorageService , dateTime , Users , pageTitle, Upload, $timeout){
     	   
   var storageType = localStorageService.getStorageType(); 
   
   $scope.options = {
      language: 'en',
      allowedContent: true,
      entities: false
   };  
   
   $scope.onReady = function () {
    
   };
   
   $scope.content = "";   
   $scope.timeformat = dateTime.showTime();     
   $scope.title = pageTitle;
                          
   $scope.savesettings = function(){
	  if(localStorageService.get('login')=="1"){ 	                  		
		   var data = {
				settings: $scope.settings					
		   };	
		   
		   var req = {
				method: 'POST',
				url: 'setting/add',
				headers: {
				  'Content-Type': 'application/json'
				},
				data: data
		   };

		   $http(req).then(
			  function(response){
					console.log(response);
					if(response.data['success']=='1'){
						$location.path("/");
					}
			  },
			  function(response){	      
					
			  }
		   );		    				
	  }
   }

   if($route.current.type=="list"){       
	    if(localStorageService.get('login')=="1"){       
			$http.get('setting/list').then(function(response){
				if(response.data['authen']==0){
					$location.path("/login");
				}
				else {
				   $scope.settings = response.data['settings'];   	  				
				}
				
			});   
		}
        else {
			$location.path("/login");
		}      
   }   
}]);


