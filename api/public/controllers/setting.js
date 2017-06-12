app.controller('setting' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', 'Users', '$state', '$stateParams', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Users, pageTitle, Upload, $timeout, Users, $state, $stateParams){
     	   
    var storageType = localStorageService.getStorageType(); 
       
    /*  $scope.adminloggedin = false;
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
    */
   
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
		  if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 	                  		
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
						if(response.data['authen']=='1'){
							$location.path("/admin/setting");
						}
						else {
							localStorageService.remove('login');
							$location.path("/login");
						}
				  },
				  function(response){	      
						
				  }
			   );		    				
		  }
		  else {
			  $location.path("/login");
		  }
     }

     if($state.current.name=="settingslist"){       
	    if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){       
			$http.get('setting/list').then(function(response){
				if(response.data['authen']==1){					
					$scope.settings = response.data['settings'];  
				}
				else {
					localStorageService.remove('login');
				    $location.path("/login");	  				
				}
				
			});   
		}
        else {
			$location.path("/login");
		}      
    }   
}]);


