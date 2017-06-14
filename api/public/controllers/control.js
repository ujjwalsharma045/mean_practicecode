app.controller('control' , ['$scope' , '$http' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' ,  'Upload', '$timeout', '$state', '$stateParams', '$modalInstance', 'pageTitle', function($scope, $http, $location, authen, localStorageService, dateTime, Users,  Upload, $timeout, $state, $stateParams , $modalInstance, pageTitle){
      	   
    var storageType = localStorageService.getStorageType();
    $scope.adminloggedin = false;
	$scope.loggedin = false;
	
    if(localStorageService.get('login')=="1"){
       if(localStorageService.get('usertype')=="admin"){       	
          $scope.adminloggedin = true;
		  $scope.loggedinusername = localStorageService.get('username');
		  var ddtt = new Date(localStorageService.get('memberfrom'));		  		  
		  $scope.memberfrom = ddtt.getDate() +"-"+ (ddtt.getMonth()+1) +"-"+ ddtt.getFullYear();
		  $scope.loggedin_filepath = localStorageService.get('profilepic');
		  $scope.loggedin = true;
	   }
	   else if(localStorageService.get('usertype')=="user"){
		  $scope.loggedin = true;
	   }
	}
        
    $scope.content = "";   
    $scope.timeformat = dateTime.showTime();     
                                                  
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

    $scope.sendrecoveremail = function () {
	   console.log($scope);
	   
	   document.getElementById("useremailerror").value = "";
	   
	   if(document.getElementById("useremail").value==""){
		  document.getElementById("useremailerror").innerHTML = "Enter email";
	   }
	   else {			  
		  $http.get('user/recoverpassword?email='+document.getElementById("useremail").value).then(function(response){
			  if(response.data['success']=="1"){
			      $modalInstance.close();	  
			  }
			  else {
				  document.getElementById("useremailerror").innerHTML = response.data['error'];
			  }
		  });
		  
	   }			  			
    };
	    
	$scope.cancel = function () {
	   $modalInstance.dismiss('cancel');
	}; 	
}]);
		