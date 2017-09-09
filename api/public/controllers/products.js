app.controller('products' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', '$state', '$stateParams', '$modal', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Users, pageTitle, Upload, $timeout, $state, $stateParams, $modal){
      alert("c");	   
    var storageType = localStorageService.getStorageType();
	
	$scope.pagemode = "";
	
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
             
    $scope.addproduct = function(){
		  if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
				if($scope.productform.$valid){
					  
					   var data = {
							title: $scope.product.title,
							description: $scope.product.description,
							meta_tag: $scope.product.meta_tag,
							meta_description: $scope.product.meta_description,
							price: $scope.product.price,
							cost_price: $scope.product.cost_price,
                            discount_type: $scope.product.discount_type,	
                            discount: $scope.product.discount,
                            status: $scope.product.status							
					   };	
					   
					   var req = {
							method: 'POST',
							url: 'product/add',
							headers: {
							  'Content-Type': 'application/json'
							},
							data: data
					   };

					   $http(req).then(
						  function(response){
								console.log(response);
								if(response.data['authen']=='1'){
									if(response.data['success']=='1'){
									   $location.path("/admin/product/index");
									}
									else {  
									   localStorageService.remove('login');
									   $location.path("/login");	
									}
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
					$scope.submitted =true; 	
				} 
		  }
		  else {
			  $location.path("/login");
		  }
    }

    $scope.editproduct = function(){
		if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
		     $scope.submitted = true;
		     if($scope.productform.$valid){
				  var data = {
					  title: $scope.product.title,
					  description: $scope.product.description,
					  meta_tag: $scope.product.meta_tag,
					  meta_description: $scope.product.meta_description,
					  price: $scope.product.price,
					  cost_price: $scope.product.cost_price,
                      discount_type: $scope.product.discount_type,	
                      discount: $scope.product.discount,
                      status: $scope.product.status							 
				  };
				  
				  var req = {
					  method:'POST',
					  url:'product/edit/'+$stateParams.id,
					  header:{
						  'Content-Type':'application/json'
					  },
					  data:data
				  };
				  
				  $http(req).then(
				     function(response){
						    console.log(response);
							if(response.data['authen']=='1'){
								if(response.data['success']=='1'){
								   $location.path("/admin/product/index");
								}
								else {  
								   localStorageService.remove('login');
								   $location.path("/login");	
								}
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
		}
		else {
		     $location.path('/login');	
		}
	}

    if($state.current.name=="editproduct" || $state.current.name=="viewproduct"){
		
		var productid = $stateParams.id
		if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){    
		    
		    $http.get('product/view/'+productid).then(
				  function(response){
					  if(response.data['authen']=="1"){
						  if(response.data['success']=="1"){
							  $scope.product = response.data['records'][0];
						  }
						  else {
							  localStorageService.remove('login'); 
						      $location.path("/login");
						  }
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
	}

    if($state.current.name=="listproducts"){
	     if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){   
		     $http.get("/product/index").then(
			    function(response){
				     if(response.data['authen']=="1"){
					     if(response.data['success']=="1"){
						     $scope.products = response.data['records'];
							 $scope.totalpages = response.data['totalpages'];
							 $scope.pages = response.data['pages'];
						 }
						 else {
							 localStorageService.remove('login');
							 $location.path('/login');
						 }
				     }
					 else {
						 localStorageService.remove('login');
						 $location.path('/login');
					 }
			    },
				function(){
					
				}
		     );
		 }
		 else {
			 $location.path('/login');
		 }
    }		

    $scope.deleteproduct = function(id , index){
		var msg  = "Are you sure you want to delete clicked product ?";
		if(window.confirm(msg)){
			$http.delete("/product/delete/"+id).then(function(response){
		        if(response.data['authen']=="1"){
					if(response.data['success']=="1"){
						$scope.products.splice(index , 1); 
						$route.reload();
					}
					else {
						localStorageService.remove('login');	
						$location.path("/login");	
					}
				}
				else {
					localStorageService.remove('login');	
					$location.path("/login");	
				}				
			},
			function(){
		          		
			});	
		}
	}
}]);


