var controlBarModule = angular.module('controlBarModule', [] )

.controller('ControlBarController', ['$scope','MapService','$timeout','ControlBarService','RoomSearchService', function($scope, MapService,$timeout, ControlBarService, RoomSearchService) {


    $scope.init = function() {
        $scope.initializing = true;
        $scope.data = {};
        $scope.data.room = {};
        $scope.data.floor = 0;
    }

    $scope.toggleSideMenu = function() {
        ControlBarService.toggleSideMenu();
    };

    $scope.closeSideMenu = function() {
        ControlBarService.closeSideMenu();
    };

    $scope.startPositioning = function() {
        MapService.showMyPosition();
        $scope.data.isPositioningMode = true;
    };

    $scope.stopPositioning = function() {
        $scope.data.isPositioningMode = false;
    };

    $scope.startRouting = function() {
        console.log("pressed start route buttn");
        var startId = 0;
        var endId = 0;
        MapService.findRoute(startId, endId);
    };


    $scope.setFloor = function(floor) {
        $scope.data.floor = floor;
    };

    $scope.$watch('data.floor', function() {
        if ($scope.initializing) {
            $timeout(function() { $scope.initializing = false; });
        } else {
            MapService.switchFloor($scope.data.floor);
        }
    });

    $scope.$on('roomFindingModeStarted', function() {
        console.log("GO FIND ROOM");
        $scope.data.room = ControlBarService.room;
        $scope.data.roomFindMode = true;
    });

    $scope.$on('roomFindingModeCanceled', function() {
        $scope.data.room = null;
        $scope.data.roomFindMode = false;
    });

    $scope.$on('mapIsInitialized', function() {
        $scope.data.floor = MapService.currentFloor;
    });

    $scope.$on('deactivatePositioningButton', function() {
        $scope.stopPositioning();
    });

    $scope.init();



}])


.service('ControlBarService', ['$rootScope', function($rootScope) {

    var showSideMenu = false;
    var room = null;

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

    this.deactivatePositioningButton = function() {
        $rootScope.$broadcast('deactivatePositioningButton');
    }

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

