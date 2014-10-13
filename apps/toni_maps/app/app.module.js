var app = new angular.module('toniMapsModule', ['mapModule', 'roomSearchModule', 'controlBarModule', 'sideMenuModule', 'ngRoute', 'ngAnimate', 'ngAnimate-animate.css', 'helpers','nouislider','NgSwitchery']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/map/:floor', {
        templateUrl: 'build/views/map.view.html',
        controller: 'MapController'
    })
    .otherwise({
        redirectTo: '/map/3'
    });
}])


.controller('WrapperController', ['$scope', 'ControlBarService',  function($scope, ControlBarService) {
	
	$scope.toggleSideMenu = function() {
        ControlBarService.toggleSideMenu();
    };

}]);