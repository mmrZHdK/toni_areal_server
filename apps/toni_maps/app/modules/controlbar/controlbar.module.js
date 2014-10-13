var controlBarModule = angular.module('controlBarModule', [] )

.controller('ControlBarController', ['$scope','MapService','$timeout','ControlBarService', function($scope, MapService,$timeout, ControlBarService) {


    $scope.init = function() {
        $scope.initializing = true;
        $scope.data = {};
        $scope.data.room = {};
        $scope.data.showFloorFlyout = false;
        $scope.data.floor = 0;
        $scope.data.handleValue = 0;
    }
    

    $scope.toggleFloorFlyout = function() {
        ControlBarService.toggleFloorFlyout();
    };

    $scope.closeFloorFlyout = function() {
        ControlBarService.closeFloorFlyout();
    };

    $scope.toggleSideMenu = function() {
        ControlBarService.toggleSideMenu();
    };

    $scope.closeSideMenu = function() {
        ControlBarService.closeSideMenu();
    };

    $scope.startPositioning = function() {
        ControlBarService.startPositioning();
    };

    $scope.stopPositioning = function() {
        ControlBarService.stopPositioning();
    };


    $scope.changeVal = function() {
        $scope.data.floor = 2;
    };

    $scope.$watch('data.floor', function() {
        if ($scope.initializing) {
            $timeout(function() { $scope.initializing = false; });
        } else {
            MapService.switchFloor($scope.data.floor);
            $scope.closeFloorFlyout();
        }

    });

    $scope.$watch('data.handleValue', function() {
        $('.noUi-handle-lower').html($scope.data.handleValue);
    });

    $scope.$on('floorFlyoutChanged', function() {
        $scope.data.showFloorFlyout = ControlBarService.showFloorFlyout;
    });

    $scope.$on('roomFindingModeStarted', function() {
        $scope.data.room = ControlBarService.room;
        $scope.data.roomFindMode = true;
    });

    $scope.$on('roomFindingModeCanceled', function() {
        $scope.data.room = null;
        $scope.data.roomFindMode = false;
    });

    $scope.$on('positioningModeChanged', function() {
        $scope.data.isPositioningMode = ControlBarService.isPositioningMode;
    });

    $scope.$on('mapIsInitialized', function() {
        //$scope.data.floor = MapService.currentFloor;
        $scope.data.handleValue = MapService.currentFloor;
    });

    $scope.init();



}])



.service('ControlBarService', ['$rootScope', function($rootScope) {

    var showFloorFlyout = false;
    var showSideMenu = false;
    var isPositioningMode = false;
    var room = null;

    this.closeFloorFlyout = function() {
        this.showFloorFlyout = false;
        $rootScope.$broadcast('floorFlyoutChanged');
    };

    this.toggleFloorFlyout = function() {
        this.showFloorFlyout = !this.showFloorFlyout;
        $rootScope.$broadcast('floorFlyoutChanged');
    };

    this.startRoomFindingMode = function(room) {
        this.room = room;
        $rootScope.$broadcast('roomFindingModeStarted');
    }

    this.cancelRoomFindingMode = function() {
        $rootScope.$broadcast('roomFindingModeCanceled');
    }

    this.toggleSideMenu = function() {
        this.showSideMenu = !this.showSideMenu;
        $rootScope.$broadcast('sideMenuChanged');
    };

    this.cliseSideMenu = function() {
        this.showSideMenu = false;
        $rootScope.$broadcast('sideMenuChanged');
    };

    this.startPositioning = function() {
        this.isPositioningMode = true;
        $rootScope.$broadcast('positioningModeChanged');
    };

    this.stopPositioning = function() {
        this.isPositioningMode = false;
        $rootScope.$broadcast('positioningModeChanged');
    };

}])



.directive('tmRoomDisplay', function() {
    return {
        restrict: 'E',

        templateUrl: 'build/templates/controlbar/templates/roomdisplay.template.html',

        link: function ($scope, element, attrs) {

        }

    };
})

.directive('tmFloorNavigation', function() {
    return {
        restrict: 'E',

        templateUrl: 'build/templates/controlbar/templates/floornavigation.template.html',

        link: function ($scope, element, attrs) {

        }

    };
});

