app.controller('custom' , ['$scope' , '$http' , function($scope, $http){
      	   
    var storageType = localStorageService.getStorageType();           
   
    $scope.userstate = false;
	$scope.pagestate = false;
    $scope.toogle = function(type){
		if(type=="user"){
			$scope.userstate = !$scope.userstate;
		}
		else if(type=="page"){
			$scope.pagestate = !$scope.pagestate;
		}
	}

    $scope.sendrecoveremail = function(){  alert("FG");	
		if(localStorageService.get('login')=="1"){ 
		   $location.path("/");
		}
		else {
	       alert("FG");	
		   var data = {
              email:$scope.useremail			   
		   };
		   
		   var req = {
               url:'user/recovery_mail',
               method:'POST',
               header:{
				  'Content-Type':'application/json' 
			   },
               data:data			   
		   };
		   
		   $http(req).then(
		         function(response){
					 if(response.data['success']=="1"){
						 
					 }
					 else {
						 
					 }
				 },
				 function(){
					 
				 }
		   );	
		}
	} 	
}]);