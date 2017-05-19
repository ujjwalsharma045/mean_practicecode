app.controller('home' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', 'vcRecaptchaService', function($scope , $http , $route , $routeParams ,$location , authen, localStorageService , dateTime , Users , pageTitle, Upload, $timeout, vcRecaptchaService){
    	   
   var storageType = localStorageService.getStorageType(); 
   $scope.model = {
                    key: '6LdqGSIUAAAAAER0Wv9KsnLaLpVDj2KaN2UiUCg6'
                };

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
    
   $scope.sendmail = function(){
	   if($scope.contactusform.$valid){
		   var data = {
			  'name':$scope.user.name,
			  'email':$scope.user.email,
			  'content':$scope.user.content,
              'recaptcharesponse':vcRecaptchaService.getResponse()			  
		   };
		   
		   var req = {
			   method:'POST',
			   url:'home/contactus',
			   headers: {
				  'Content-Type': 'application/json' 
			   },
			   data:data
		   };
	   
		   $http(req).then(
			  function(response){
				  $route.reload();
				  if(response.data['success']=="1"){
					 
				  }
				  else {
					  
				  }
			  },		 
			  function(response){
				  
			  }
		   );
       }
       else {
		   $scope.submitted = true;
	   }	   
   }
   
   $scope.logout = function(){
	  localStorageService.remove('login');
	  $location.path("/login"); 	   
   }     
}]);


