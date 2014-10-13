var roomSearchModule = angular.module('sideMenuModule', [] )

.controller('SideMenuController', ['$scope', 'ControlBarService', 'MapService', function($scope, ControlBarService, MapService) {

	$scope.init = function() {
		$scope.data = {};
		$scope.data.showSideMenu = false;

		$scope.data.showIconsFood = !MapService.hideIconsFood; 
	    $scope.data.showIconsCopy = !MapService.hideIconsCopy; 
	    $scope.data.showIconsSurf = !MapService.hideIconsSurf;
	    $scope.data.showIconsToilets = !MapService.hideIconsToilets;
	    $scope.data.showIconsElevators = !MapService.hideIconsElevators;
	    $scope.data.showIconsRecycle = !MapService.hideIconsRecycle;
	};
	

	$scope.$on('sideMenuChanged', function() {
		$scope.data.showSideMenu = ControlBarService.showSideMenu;

		if($scope.data.showSideMenu) {
			$('#wrapper-all').addClass('side-menu-offset');
		} else {
			$('#wrapper-all').removeClass('side-menu-offset');
		}
	});

	$scope.$watch('data.showIconsFood', function() {
        MapService.setHideIconsFood(!$scope.data.showIconsFood);
    });

    $scope.$watch('data.showIconsCopy', function() {
        MapService.setHideIconsCopy(!$scope.data.showIconsCopy);
    });

    $scope.$watch('data.showIconsSurf', function() {
        MapService.setHideIconsSurf(!$scope.data.showIconsSurf);
    });

    $scope.$watch('data.showIconsToilets', function() {
        MapService.setHideIconsToilets(!$scope.data.showIconsToilets);
    });

    $scope.$watch('data.showIconsElevators', function() {
        MapService.setHideIconsElevators(!$scope.data.showIconsElevators);
    });

    $scope.$watch('data.showIconsRecycle', function() {
        MapService.setHideIconsRecycle(!$scope.data.showIconsRecycle);
    });

	$scope.init();

}])

.directive('tmSideMenu', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/sidemenu/templates/sidemenu.template.html',

        link: function ($scope, element, attrs) {

        }

    };
})