app.directive('titleelement' , function(){
	return {
        restrict : "E",		
        template:"<h1>{{title}}</h1>" 
	};
});

app.directive('timeelement' , function(){
	return {
        restrict : "A",		
        template:"<div style='float:right'><b>Time:</b> {{timeformat}}&nbsp;&nbsp;</div>" 
	};
});

app.directive('ckEditor', function () {
        return {
			require: '?ngModel',
			link: function (scope, elm, attr, ngModel) {
			  var ck = CKEDITOR.replace(elm[0]);
			  if (!ngModel) return;
			  ck.on('instanceReady', function () {
				ck.setData(ngModel.$viewValue);
			  });
			  function updateModel() {
				scope.$apply(function () {
				  ngModel.$setViewValue(ck.getData());
				});
			  }
			  ck.on('change', updateModel);
			  ck.on('key', updateModel);
			  ck.on('dataReady', updateModel);

			  ngModel.$render = function (value) {
				ck.setData(ngModel.$viewValue);
			  };
			}
	    };
});
   
app.directive('fancybox' , function($compile, $http){
	var fdirective = {};
	fdirective.restrict = 'A';
	fdirective.link = function($scope){
		$scope.showview = function(id){			
			$http.get('http://127.0.0.1:8081/viewhtml/'+id).then(function(response){ 
			    var data = response.data;
				var compiledTemplate = $compile(data);
                compiledTemplate($scope);
				$.fancybox.open({content:data , type:'html'});
			});
		}
	};
	return fdirective;
});   
   
