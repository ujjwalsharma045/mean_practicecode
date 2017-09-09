app.controller('category' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Category' , 'pageTitle', 'Upload', '$timeout', '$state', '$stateParams', '$modal', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Category, pageTitle, Upload, $timeout, $state, $stateParams, $modal){
     
    var storageType = localStorageService.getStorageType();
	
	$scope.pagemode = "";
	$scope.submitted =false;
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
	
    Category.list($scope);
	
    $scope.addcategory = function(){		
		if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 		   		   
		   $scope.submitted = true;
		   if($scope.categoryform.$valid){		   
			   var data = {
				   parent_id:$scope.category.parent_category,
				   title:$scope.category.title,
				   description:$scope.category.description,
				   meta_tag:$scope.category.meta_tag,
				   meta_description:$scope.category.meta_description,
				   order:$scope.category.order,
				   status:$scope.category.status
			   };
			   
			   var req = {
				 url:'category/add',
                 method:'POST',
                 data:data,
                 headers:{
					 'Content-Type': 'application/json'
				 }				 
			   };
			   
			   $http(req).then(
				   function(response){
					  if(response.data['authen']=="1"){
						  if(response.data['success']=="1"){
						     //$location.path("/admin/product/index");
						  }
						  else if(response.data['success']=="0"){
							  if(response.data['error']!=""){
								  
							  }
						  }
					  }
                      else {
						  localStorageService.remove("login");
						  $location.path("/login");
					  } 					  
				   },
				   function(response){
					   
				   }
		       ); 				   
		   }		   
		}
		else {
			$location.path("/login");
		}
	};
	
	$scope.viewcategory = function(){
		
	};
	
	$scope.editcategory = function(id){
		
	};
}]);


