app.controller('contactus' , function($scope, dateTime, pageTitle , NgMap){
   $scope.timeformat = dateTime.showTime();     
   $scope.title = pageTitle;
   
   NgMap.getMap().then(function(evtMap) {
      map = evtMap;
      interval = $interval(talk, 2000);
   });
});


