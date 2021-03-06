app.controller('front' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', '$state', '$stateParams', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Users, pageTitle, Upload, $timeout, $state, $stateParams){
      	   
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
	
    $scope.userstate = false;
	$scope.pagestate = false;
	$scope.productstate = false;
	$scope.categorystate = false;
    $scope.toogle = function(type){
		if(type=="user"){
			$scope.userstate = !$scope.userstate;
		}
		else if(type=="page"){
			$scope.pagestate = !$scope.pagestate;
		}
		else if(type=="product"){
			$scope.productstate = !$scope.productstate;
		}
		else if(type=="category"){
			$scope.categorystate = !$scope.categorystate;
		}
	}

    $scope.sendrecoveremail = function(){
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