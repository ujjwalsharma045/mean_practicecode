app.service('Element' , function($scope, $http, $route, $location, $routeParams){
	this.header = function(titlename){
		var titletag = "<h1>"+titlename+"</h1>";
		$scope.title = titletag;
		return; 
	}
	
	this.footer = function(title){
		return "<span>"+title+"<span>";
	}
});