app.controller('users' , ['$scope' , '$http' , '$route' , '$routeParams' ,'$location' , 'authen', 'localStorageService' , 'dateTime' , 'Users' , 'pageTitle', 'Upload', '$timeout', '$state', '$stateParams', '$modal', function($scope, $http, $route, $routeParams, $location, authen, localStorageService, dateTime, Users, pageTitle, Upload, $timeout, $state, $stateParams, $modal){
      	   
    var storageType = localStorageService.getStorageType();
	
    /* $scope.adminloggedin = false;
	$scope.loggedin = false;
	
    if(localStorageService.get('login')=="1"){
       if(localStorageService.get('usertype')=="admin"){       	
          $scope.adminloggedin = true;
		  $scope.loggedin = true;
	   }
	   else if(localStorageService.get('usertype')=="user"){
		   $scope.loggedin = true;
	   }
	} */
    
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
      
    if($state.current.name=="list"){
	    Users.totalUsers($scope);
		
        $scope.user = {
		  searchemail:'',
          searchusername:'',
          searchfirstname:'',
          searchlastname:'',
          limit:5,
          sortfields:'first_name',
          sortfieldtype:'desc',
          age:0,
		  options: {
            ceil: 10,
            floor: 0,
            showTicksValues: true,
          },
		  ids:[]
	    };
		
	   	$scope.selected = [];
		
        $scope.sort = {
		  first_name:'',
          last_name:'',
          email:'',
          username:'' 		  		   
	    };
		
		$scope.current_page = 1;		  
        $scope.totalpages = 0;
		$scope.pages = 0;
		
		$scope.current_page = 1;
          
        if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){   
			$http.get('showusers?limit='+$scope.user.limit+'&sortfield='+$scope.user.sortfields+'&sorttype='+$scope.user.sortfieldtype).then(function(response){
				      if(response.data['authen']=="1"){				
						   if(response.data['success']=="1"){
							  console.log(response.data['records']);
					          $scope.users = response.data['records'];
					          $scope.pages = response.data['pages'];                      
                              $scope.totalpages = response.data['totalpages'];
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
		    });	   
		}	 
		else {
			$location.path("/login");
		}   
    }
    
    if($state.current.name=="view"){  
         $scope.title += ' '+$stateParams.id;
		 if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){    
			$http.get('view/'+$stateParams.id).then(function(response){
                    if(response.data['authen']=="1"){				
					   if(response.data['success']=="1"){
					      $scope.user = response.data['records']; 
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
				$http.delete('delete/'+id).then(function(response){
					if(response.data['authen']=='1'){
						if(response.data['success']=='1'){
						   $scope.users.splice(index , 1); 
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
				});
			}
			else {
				$location.path("/login");
			}
		}
		else {
			$location.path("/login");
		}
    }
    
    if($state.current.name=="edituser"){   
        
		$scope.title +=' '+$stateParams.id;
		
        if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){       
			$http.get('view/'+$stateParams.id).then(function(response){
				if(response.data['authen']=="1"){				
				   if(response.data['success']=="1"){
					  $scope.user = response.data['records'][0]; 
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
			});   
		}
        else {
			$location.path("/login");
		}		
    } 
   
    $scope.edituser = function(file){	   	   	   
	   if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){    
		   if($scope.userform.$valid){	   			  
				  if(file){ 					   
                       var data = {
							first_name: $scope.user.first_name,
							last_name: $scope.user.last_name,
							address: $scope.user.address,
							state: $scope.user.state,
							city: $scope.user.city,
							zipcode: $scope.user.zipcode,
							userid: $routeParams.id,
							file:file,
							dateofbirth: $scope.user.dateofbirth                
				       };
 
                       file.upload = Upload.upload({
							  url:'edit/'+$stateParams.id,
							  data:data
				       });

					   file.upload.then(
						   function (response) {
							  /* $timeout(function () {
								file.result = response.data;
							  });*/
							  if(response.data['authen']=='1'){
								  if(response.data['success']=='1'){
									  $location.path("/admin/user/index");
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
						   function (response) {
								//if(response.status >0)
							   //$scope.errorMsg = response.status + ': ' + response.data;
						   }, 
						   function (evt) {
							  //Math.min is to fix IE which reports 200% sometimes
							 //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						   }
					   );  
			      }
                  else {
					   var data = {
							first_name: $scope.user.first_name,
							last_name: $scope.user.last_name,
							address: $scope.user.address,
							state: $scope.user.state,
							city: $scope.user.city,
							zipcode: $scope.user.zipcode,
							userid: $routeParams.id,
							dateofbirth: $scope.user.dateofbirth                
				       };
                      
					   var req = {
						    method: 'POST',
						    url: 'edit/'+$stateParams.id,
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
									  $location.path("/admin/user/index");
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
			  $scope.submitted =true; 
		   } 
	   }
	   else {
		   $location.path("/login");
	   }
    }   
    
    $scope.adduser = function(file){
	  if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
	    if($scope.userform.$valid){
            if(file){
				var data = {
					first_name: $scope.user.first_name,
					last_name: $scope.user.last_name,
					email: $scope.user.email,
					username: $scope.user.username,
					password: $scope.user.password,
					dateofbirth: $scope.user.dateofbirth,
					file:file                
				};
				
				file.upload = Upload.upload({
					  url:'adduser',
					  data:data
				});

				file.upload.then(
				   function (response) {
					  /* $timeout(function () {
						file.result = response.data;
					  });*/
					  if(response.data['authen']=='1'){
						    if(response.data['success']=='1')
							  $location.path("/admin/user/index");
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
				   function (response) {
						//if(response.status >0)
					   //$scope.errorMsg = response.status + ': ' + response.data;
				   }, 
				   function (evt) {
					  //Math.min is to fix IE which reports 200% sometimes
					 //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				   }
				);
			}			
            else {			  
               var data = {
					first_name: $scope.user.first_name,
					last_name: $scope.user.last_name,
					email: $scope.user.email,
					username: $scope.user.username,
					password: $scope.user.password,
					dateofbirth: $scope.user.dateofbirth,
					file:''                
			   };	
			   
			   var req = {
					method: 'POST',
					url: 'adduser',
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
							   $location.path("/admin/user/index");
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
		    $scope.submitted =true; 	
		} 
	  }
	  else {
		  $location.path("/login");
	  }
    }
    
    $scope.loginuser = function(){	  
	    $scope.errormessage = '';
	    if($scope.userform.$valid){	   
			
            var data = {                
                username: $scope.user.username,
                password: $scope.user.password                
			};
                      
			var req = {
			    method: 'POST',
			    url: 'login',
			    headers: {
			      'Content-Type': 'application/json'
			    },
			    data: data
			};

            $http(req).then(
				  function(response){
					    console.log(response);
					    if(response.data['success']=='1'){
							if(response.data['usertype']=='admin'){
							   localStorageService.set('login', '1'); 
							   localStorageService.set('usertype', 'admin');
							   localStorageService.set('username' , response.data['records'].first_name+" "+response.data['records'].last_name);
							   localStorageService.set('memberfrom' , response.data['records'].created_at);
                               localStorageService.set('profilepic' , response.data['records'].profile_pic);
							   $location.path("/admin/dashboard");
							}
							else {
							   localStorageService.set('login', '1');
							   localStorageService.set('usertype', 'user');
							   localStorageService.set('username' , response.data['records'].first_name+" "+response.data['records'].last_name);
							   localStorageService.set('memberfrom' , response.data['records'].created_at);
							   $location.path("/home");	
							}
						}
						else {							
					        $scope.errormessage = "Either Name or salary is incorrect";
						} 
				  },
				  function(response){	      
						
				  }
			);			
		}
		else {
		    $scope.submitted =true; 	
		}	  
    }; 

    if($state.current.name=="logout"){    
        $http.get('api/logout.php').then(function(response){	
			if(response.data['success']=='1'){
			    $location.path("/login");
			}
			else {			
				$location.path("/"); 	  			
			}							   	  		
		});         
    }   
   
    $scope.setPageNo = function(no){
	   $scope.current_page  = no+1;
    }
   
    $scope.searchUser = function(name){
       
	   var data = "";
	   
	   if($scope.user.searchemail){
		  data = data+"email="+$scope.user.searchemail; 
	   }
       
       if($scope.user.age && $scope.user.age>0){
		  if(data!="") data+="&"; 
		  data = data+"age="+$scope.user.age; 
	   }
	   
	   if($scope.user.searchusername){
		  if(data!="") data+="&"; 
		  data = data+"username="+$scope.user.searchusername; 
	   }

       if($scope.user.searchfirstname){
		  if(data!="") data+="&"; 
		  data = data+"first_name="+$scope.user.searchfirstname; 
	   }

       if($scope.user.searchlastname){
		  if(data!="") data+="&"; 
		  data = data+"last_name="+$scope.user.searchlastname; 
	   } 

       var sorttype = "";
	          
	   if(name=="first_name"){
		   if($scope.sortfirst_name=="desc"){
              $scope.sortfirst_name = "asc";			   
			  sorttype = "asc";   	
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortfirst_name = "desc"; 
			  sorttype = "desc"; 
			  $scope.sortReverse = true; 
		   }
		   
		   $scope.sortfields = "first_name";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype; 
		   
		   $scope.sortType = 'sortfirstname';	   
		   
	   }
	   else if(name=="last_name"){
		   if($scope.sortlast_name=="desc"){
			  $scope.sortlast_name = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortlast_name = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "last_name";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
           data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortlastname';	   		   
	   }
	   else if(name=="email"){
		   if($scope.sortemail=="desc"){
			  $scope.sortemail = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false; 			  
		   }
		   else {
			  $scope.sortemail = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "email";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortemail';	   		   
	   }
	   else if(name=="username"){
		   if($scope.sortusername=="desc"){
			  $scope.sortusername = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortusername = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "username";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortusername';	   		   
	   }        
	   else if(name=="dateofbirth"){
		   if($scope.sortdateofbirth=="desc"){
			  $scope.sortdateofbirth = "asc"; 
			  sorttype = "asc";
              $scope.sortReverse = false;			  
		   }
		   else {
			  $scope.sortdateofbirth = "desc"; 
			  sorttype = "desc";
              $scope.sortReverse = true;			  
		   }
		   
		   $scope.sortfields = "dateofbirth";
		   $scope.sortfieldtype = sorttype;
		   if(data!="") data+="&"; 
		   
		   data = data+"sortfield="+name+"&sorttype="+sorttype;
		   
           $scope.sortType = 'sortdateofbirth';	   		   
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
	   
	   if($scope.user.limit){
		  if(data!="") data+="&"; 
		  data = data+"limit="+$scope.user.limit; 
	   }
	   
       $http.get('showusers?'+data).then(function(response){	  
	       $scope.users = response.data['records'];   	  					   
           $scope.pages = response.data['pages'];           
           $scope.totalpages = response.data['totalpages']; 	   
	   });	
    }

    //if($route.current.type=="login"){  
	if($state.current.name=="login"){           
        $http.get('checklogin').then(function(response){	
			if(response.data['authen']=='1'){
				//localStorageService.set('login' , '1');
			    //$location.path("/");
			}										   	  	
		});         
    }  

    $scope.sortlist = function(name){
	   $scope.searchUser(name);
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
       angular.forEach($scope.users, function (x) {
            x.Selected = true;			
       });	   
    }

    $scope.uncheckAllToggle = function(){	   
	   angular.forEach($scope.users, function (x) {
            x.Selected = false;			
       });	   
    }

    $scope.removeUsers = function(){	   
       $scope.selected = [];
	   angular.forEach($scope.users, function (value , key) {
		    console.log(value.Selected);		
			if(value.Selected){
              $scope.selected[key] = value._id;
			}
       });
       console.log($scope.selected);
	   
	   if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="admin"){ 
		   var ids = $scope.selected.join();
		   $http.delete('removemultiple?ids='+ids).then(function(response){	
				if(response.data['authen']=='1'){
					//localStorageService.set('login' , '1');
					$state.reload();
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

    $scope.editpassword = function(){
	   if(localStorageService.get('login')=="1"){ 
	     if($scope.userpassword.$valid){
		    
			data = {
			   oldpassword:$scope.user.password,
			   newpassword:$scope.user.newpassword,
			   confirmpassword:$scope.user.confirmpassword,
			};
			
			var req = {
				url:'user/editpassword',
				method:'POST',
				header:{
					'Content-Type':'application/json'
				},
				data:data
			};
			
			$http(req).then(
				function(response){
					if(response.data['authen']=="1"){
						if(response.data['success']=="1"){
							$state.reload();
						}
						else if(response.data['success']=="0"){
							$scope.errors = response.data['errors'];
						}
					}
					else {
						$location.path('/login');
					}
				},
				function(){
					
				}
            );				
		 }
		 else {
			 $scope.userpassword.$submitted =true;
		 }
       }
	} 
	
	$scope.editprofile = function(){
	   if(localStorageService.get('login')=="1"){ 
			if($scope.userprofileform.$valid){
					
					/* var data = {
					   username:$scope.user.password,
					   newpassword:$scope.user.newpassword,
					   confirmpassword:$scope.user.confirmpassword,
					};*/
					
					var req = {
						url:'user/editprofile',
						method:'POST',
						header:{
							'Content-Type':'application/json'
						},
						data:$scope.userprofile
					};
					
					$http(req).then(
						function(response){
							if(response.data['authen']=="1"){
								if(response.data['success']=="1"){
									$state.reload();
								}
								else if(response.data['success']=="0"){
									$scope.profileerrors = response.data['errors'];
								}
							}
							else {
								$location.path('/login');
							}
						},
						function(){
							
						}
					);				
			}
			else {			
			     $scope.userprofileform.$submitted =true;
			}
		}
	}
	
	if($state.current.name=="profile"){           
		 if(localStorageService.get('login')=="1" && localStorageService.get('usertype')=="user"){    
			$http.get('user/editprofile').then(function(response){
                    if(response.data['authen']=="1"){				
					   if(response.data['success']=="1"){
					      $scope.userprofile = response.data['records'][0]; 
					   }
					   else {
						  localStorageService.remove('login'); 
						  localStorageService.remove('user'); 
						  $location.path("/login");
					   }
					}					  
				    else {
					   localStorageService.remove('login');	
					   localStorageService.remove('user'); 
                       $location.path("/login");
					}
			});     
		 }
         else {
			$location.path("/login");
		 }		 
    }
	
  	$scope.show_recoverypopup = function(){				
		var modalInstance = $modal.open({
            templateUrl: '/views/users/myModalContent.html',
            controller: 'control',
			scope:$scope,
            //size: size,
            resolve: {                
				pageTitle:function(){					  
					   return "Forgot Password";
				}
            }
        });
        
        modalInstance.result.then(function (selectedItems) {
            //products = selectedItems;
			console.log($scope);  
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });	
	}

    $scope.resetpassword = function(){				
	    if($scope.useresetpassword.$valid){
			var data = {
				password:$scope.user.newpassword,
				token:$scope.user.token		  
			};
		
			var req = {
				 url:'user/changepassword',
				 method:'POST',
				 header:{
					'Content-Type':'application/json'
				 },
				 data:data,			 
			};
		
			$http(req).then(function(response){
				if(response.data['success']=="1"){
					$state.reload();
				}
				else {
					
				}
			}, function(response){
				
			});
		}
        else {
			$scope.useresetpassword.$submitted = true;
		}  		
	}

	if($state.current.name=="resetpassword"){
        console.log($stateParams);		
	    $http.get('user/resetpassword/'+$stateParams.token).then(function(response){
			if(response.data['success']=="1"){				
			   $scope.user = response.data['records'];
			}					  
			else {			   
			   $location.path("/home/index");
			}
		}); 
	}  	
}]);


