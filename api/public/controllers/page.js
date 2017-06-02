app.controller('page' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Pages' , 'pageTitle', 'Upload', '$timeout', 'Users', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Pages, pageTitle, Upload, $timeout, Users){
       	   
    var storageType = localStorageService.getStorageType();
    $scope.adminloggedin = false;
	$scope.loggedin = false;
	$scope.pagemode = "";
    if(localStorageService.get('login')=="1"){
       if(localStorageService.get('usertype')=="admin"){       	
          $scope.adminloggedin = true;
		  $scope.loggedin = true;
	   }
	   else if(localStorageService.get('usertype')=="user"){
		   $scope.loggedin = true;
	   }
	}
		
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
    $scope.statusarr = [
		{
		  'id':'A',
		  'title':'Active'		   
		},
		{
		  'id':'I',
		  'title':'Inactive'		   
		}
	];  
	
    if($route.current.type=="list"){
	    Pages.totalPages($scope);				
		
        $scope.page = {
		   searchtitle:'',
		   searchcontent:'',
		   searchstatus:'',          
		   limit:5,
		   sortfields:'title',
		   sortfieldtype:'desc',          
		   options: {
			 ceil: 10,
			 floor: 0,
			 showTicksValues: true,
		   },
		   ids:[]		 
	    };
		
	   	$scope.selected = [];
		
        $scope.sort = {
		  title:'',
          content:'',
          status:'',           		  		  
	    };
		
		$scope.current_page = 1;		  
        $scope.totalpages = 0;
		$scope.pages = 0;
		
		$scope.current_page = 1;
          
        if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){   
			$http.get('page/index?limit='+$scope.page.limit+'&sortfield='+$scope.page.sortfields+'&sorttype='+$scope.page.sortfieldtype).then(function(response){
				      if(response.data['authen']=="1"){				
						   if(response.data['success']=="1"){
							  console.log(response.data['records']);
					          $scope.pagescontent = response.data['records'];
					          $scope.pages = response.data['pages'];                      
                              $scope.totalpages = response.data['totalpages'];
						   }
						   else {
							  localStorageService.remove('login'); 
							  localStorageService.remove('admin');
							  $location.path("/login");
						   }
					  }					  
					  else {
						   localStorageService.remove('login');
						   localStorageService.remove('admin');
						   $location.path("/login");
					  }		              
		    });	   
		}	 
		else {
			$location.path("/login");
		}   
    }
    
    if($route.current.type=="view"){  
         $scope.title += ' '+$routeParams.id;
		 if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){    
			$http.get('page/view/'+$routeParams.id).then(function(response){
                    if(response.data['authen']=="1"){				
					   if(response.data['success']=="1"){
					      $scope.page = response.data['records']; 
					   }
					   else {
						  localStorageService.remove('login'); 
						  localStorageService.remove('admin');
						  $location.path("/login");
					   }
					}					  
				    else {
					   localStorageService.remove('login');	
					   localStorageService.remove('admin');
                       $location.path("/login");
					}
			});     
		 }
         else {
			$location.path("/login");
		 }		 
    }
       
    $scope.remove = function(id , index){  
        var msg = "Are you sure you want to remove";
		if(window.confirm(msg)){
			if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){       
				$http.delete('page/delete/'+id).then(function(response){
					if(response.data['authen']=='1'){
						if(response.data['success']=='1'){
						   $scope.pagescontent.splice(index , 1); 
						   $route.reload();					
						}
						else {
						   localStorageService.remove('login');
                           localStorageService.remove('admin');						   
						   $location.path("/login");	
						}
					}
                    else {
						localStorageService.remove('login');
						localStorageService.remove('admin');
						$location.path("/login");
					}					
				});
			}
			else {
				$location.path("/login");
			}
		}
    }
   
    if($route.current.type=="edit"){           
		$scope.title +=' '+$routeParams.id;
		$scope.pagemode = "edit";
        if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){       $http.get('page/view/'+$routeParams.id).then(function(response){
					if(response.data['authen']=="1"){				
					   if(response.data['success']=="1"){
						  $scope.page = response.data['records'][0]; 
					   }
					   else {
						  localStorageService.remove('login'); 
						  localStorageService.remove('admin');
						  $location.path("/login");
					   }
					}					  
					else {
					   localStorageService.remove('login');	
					   localStorageService.remove('admin');
					   $location.path("/login");
					}				
			  });   
		}
        else {
			$location.path("/login");
		}		
    } 
   
    if($route.current.type=="add"){
	    $scope.pagemode = "add";
	}
	
    $scope.editpage = function(){	   	   	   
	   if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){    
		   if($scope.pageform.$valid){	   			  
				 
					   var data = {
							title: $scope.page.title,
							content: $scope.page.content,							
							status: $scope.page.status                
				       };
                      
					   var req = {
						    method: 'POST',
						    url: 'page/edit/'+$routeParams.id,
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
									  $location.path("/page/index");
								  }
								  else {
									  localStorageService.remove('login');
									  localStorageService.remove('admin');
									  $location.path("/login");
								  }
							  }
							  else {
								  localStorageService.remove('login');
								  localStorageService.remove('admin');
								  $location.path("/login");
							  }						     
					       },
						   function(response){	      
							
					       }
					   );
				  				  			  					               			
		   }
		   else {
			  $scope.pageform.submitted =true; 
		   } 
	   }
	   else {
		   $location.path("/login");
	   }
    }   
    
    $scope.addpage = function(){
	  if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
	    if($scope.pageform.$valid){
            			  
               var data = {
					title: $scope.page.title,
					content: $scope.page.content,
					status: $scope.page.status
			   };	
			   
			   var req = {
					method: 'POST',
					url: 'page/add',
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
							   $location.path("/page/index");
							}
							else {  
							   localStorageService.remove('login');
							   localStorageService.remove('admin');
							   $location.path("/login");	
							}
						}
						else {
							localStorageService.remove('login');
							localStorageService.remove('admin');
							$location.path("/login");
						}
				  },
				  function(response){	      
						
				  }
			   );
		    			
		}
		else {
		    $scope.pageform.submitted =true; 	
		} 
	  }
	  else {
		  $location.path("/login");
	  }
    }
           
    $scope.setPageNo = function(no){
	   $scope.current_page  = no+1;
    }
   
    $scope.searchPage = function(name){
       
	   var data = "";
	   
	   if($scope.page.title){
		  data = data+"title="+$scope.page.title; 
	   }
       
	   if($scope.page.content){
		  if(data!="") data+="&"; 
		  data = data+"content="+$scope.page.content; 
	   }

       if($scope.page.status){
		  if(data!="") data+="&"; 
		  data = data+"status="+$scope.page.status; 
	   }
       
       var sorttype = "";
	          
	   if(name=="title"){
		   if($scope.sorttitle=="desc"){
              $scope.sorttitle = "asc";			   
			  sorttype = "asc";   	
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sorttitle = "desc"; 
			  sorttype = "desc"; 
			  $scope.sortReverse = true; 
		   }
		   
		   $scope.sortfields = "title";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype; 
		   
		   $scope.sortType = 'sortfirstname';	   
		   
	   }
	   else if(name=="content"){
		   if($scope.sortcontent=="desc"){
			  $scope.sortcontent = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortcontent = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "content";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
           data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortlastname';	   		   
	   }
	   else if(name=="status"){
		   if($scope.sortstatus=="desc"){
			  $scope.sortstatus = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false; 			  
		   }
		   else {
			  $scope.sortstatus = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "status";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortemail';	   		   
	   }	   
	   else {
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+$scope.sortfields+"&sorttype="+$scope.sortfieldtype;
		   
           $scope.sortType = '';	   		   
	   }	
	   
	   if($scope.current_page){
		   if(data!="") data+="&"; 
	       data = data+"page="+$scope.current_page;
	   }
	   
	   if($scope.page.limit){
		  if(data!="") data+="&"; 
		  data = data+"limit="+$scope.page.limit; 
	   }
	   
       $http.get('page/index?'+data).then(function(response){	  
	       $scope.pagescontent = response.data['records'];   	  					   
           $scope.pages = response.data['pages'];           
           $scope.totalpages = response.data['totalpages']; 	   
	   });	
    }

    $scope.sortlist = function(name){
	   $scope.searchPage(name);
	   /*var sorttype = "";
	   	   	   
	   if(name=="first_name"){
		   if($scope.sortfirst_name=="desc"){
              $scope.sortfirst_name = "asc";			   
			  sorttype = "asc";   			   
		   }
		   else {
			  $scope.sortfirst_name = "desc"; 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="last_name"){
		   if($scope.sortlast_name=="desc"){
			  $scope.sortlast_name = "asc"; 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortlast_name = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="email"){
		   if($scope.sortemail=="desc"){
			  $scope.sortemail = "asc" 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortemail = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   else if(name=="username"){
		   if($scope.sortusername=="desc"){
			  $scope.sortusername = "asc" 
			  sorttype = "asc";   
		   }
		   else {
			  $scope.sortusername = "desc" 
			  sorttype = "desc"; 
		   }
	   }
	   
	   $http.get('http://127.0.0.1:8081/showusers?sortfield='+name+'&sorttype='+sorttype).then(function(response){	  
	         $scope.users = response.data;   	  			
	   });*/
    }

    /*$scope.checkAllToggle = function(){
	   //alert($scope.user.checkall);
	   console.log($scope.user.ids);
	   
	   if($scope.user.checkall){
		   $scope.user.checkall = false;
	   }
	   else {
		   $scope.user.checkall = true;		   
	   }
	   
	   angular.forEach($scope.users, function (x) {
            x.Selected = $scope.user.checkall;
			
       });
	   console.log($scope.users);
   }*/

    $scope.checkAllToggle = function(){	 
       angular.forEach($scope.pagescontent, function (x) {
            x.Selected = true;			
       });	   
    }

    $scope.uncheckAllToggle = function(){	   
	   angular.forEach($scope.pagescontent, function (x) {
            x.Selected = false;			
       });	   
    }

    $scope.removePages = function(){	   
       $scope.selected = [];
	   angular.forEach($scope.pages, function (value , key) {
		    console.log(value.Selected);		
			if(value.Selected){
              $scope.selected[key] = value._id;
			}
       });
       console.log($scope.selected);
	   
	   if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
		   var ids = $scope.selected.join();
		   $http.delete('page/removemultiple?ids='+ids).then(function(response){	
				if(response.data['authen']=='1'){
					//localStorageService.set('login' , '1');
					$route.reload();
				}
				else {
					localStorageService.remove('login');
					localStorageService.remove('admin');
					$location.path("/login");
				}			
		   }); 	   	  
	   }
	   else {
		   $location.path("/login");
	   }
    }     				
	
	$scope.logout = function(){
	    Users.logOut($scope, $location, localStorageService);
	}
}]);


