$( document ).ready(function() {

    resizeScreen();

    $( window ).resize(function() {
        resizeScreen();
    });

    document.addEventListener("touchmove", function(event){
        event.preventDefault();
    });

});



function resizeScreen() {
    var height = window.innerHeight ? window.innerHeight : $(window).height();
    $('body').height(height);
    $('html').height(height);
    $('.wrapper-all').height(height);
}

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