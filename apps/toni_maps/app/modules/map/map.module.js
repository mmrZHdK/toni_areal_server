var mapModule = angular.module('mapModule', [ ] )

.controller('MapController', ['$scope','$rootScope','$routeParams','MapService','RoomSearchService', 'ControlBarService', '$window','$timeout', function($scope, $rootScope, $routeParams, MapService, RoomSearchService, ControlBarService,$window, $timeout) {


    $scope.init = function() {
        $scope.data = {};
        $scope.data.svgUrl = 'build/maps/toni_map_floor_' + $routeParams.floor + '.svg';
        MapService.currentFloor = $routeParams.floor;
        $scope.data.currentFloor = MapService.currentFloor;
        $scope.data.nextFloorIsHigher = MapService.nextFloorIsHigher;

        $scope.data.hideRoomLabels = true;
        $scope.data.hideIconsAll = true;
        $scope.data.hideIconsFood = MapService.hideIconsFood;
        $scope.data.hideIconsCopy = MapService.hideIconsCopy;
        $scope.data.hideIconsSurf = MapService.hideIconsSurf;
        $scope.data.hideIconsToilets = MapService.hideIconsToilets;
        $scope.data.hideIconsElevators = MapService.hideIconsElevators;
        $scope.data.hideIconsRecycle = MapService.hideIconsRecycle;
        $scope.data.zoom = 0.5;
        $scope.data.tempScale = 0.5;

        $rootScope.$broadcast('mapIsInitialized');
        
    }


    $scope.initSvg = function() {
        var section = $('#map-pane-' + $scope.data.currentFloor);
        $scope.svg = section.find('svg');
        $scope.svg.panzoom({
            increment: 0.5, 
            maxScale: 15,
            minScale: 0.5,
            //contain: 'invert',
            onPan: $scope.mapMoved,
            onZoom: $scope.mapZoomed
        });

        $scope.markRoomShape();

        if(MapService.isMovingToHighlightRoom) {
            $scope.moveToRoomShape();
            MapService.isMovingToHighlightRoom = false;
        } else {
            $scope.svg.panzoom('zoom',0.5);
            $scope.svg.panzoom('pan',-225,-320);    
        }

        
    };

    $scope.markRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {
            var shape = $('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            if(shape != null) {
                shape.get(0).setAttribute('class', 'svg-room highlighted');   
            }
        }
    };

    $scope.unmarkRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {
            var shape = $('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            if(shape != null) {
                shape.get(0).setAttribute('class', 'svg-room'); 
                MapService.roomToHighlight = null;
            }
        }
    };

    $scope.moveToRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {
            
            $scope.svg.panzoom('zoom',1.5,{
                animate: false
            })

            var roomShape = $('[id="'+MapService.roomToHighlight.planRoomNr+'"]');

            var pos = roomShape.position();
            

            
            var focalPos = {};
            focalPos.clientX = ($window.innerWidth / 2) - (pos.left + roomShape.get(0).getBoundingClientRect().width/2);
            focalPos.clientY = ($window.innerHeight / 2) - (pos.top + roomShape.get(0).getBoundingClientRect().height/2);

            $scope.svg.panzoom("pan", focalPos.clientX, focalPos.clientY, {
                relative: true, 
                animate: true
            });

            
        }
    }

    $scope.mapMoved = function() {
        if(ControlBarService.showFloorFlyout) {
            ControlBarService.closeFloorFlyout();    
        }
    };

    $scope.mapZoomed = function(e, panzoom, scale) {

        if(Math.abs(scale - $scope.data.tempScale) > 0.2 ) {
            $timeout(function() {
                $scope.data.hideRoomLabels = (scale < 1.2);
                $scope.data.hideIconsAll = (scale < 0.7);
            },100);

            
            $scope.data.tempScale = scale;
        }

        
    };

    $scope.$watch('data.zoom', function() {
        if($scope.svg !== undefined) {
            $scope.svg.panzoom('zoom',(1.5/100*$scope.data.zoom) + 0.5);
        }
    });

    $scope.$on('hightlightRoomOnSameFloor', function() {
        $scope.markRoomShape();
        $scope.moveToRoomShape();
    });

    $scope.$on('unhightlightRoom', function() {
        $scope.unmarkRoomShape();
    });

    $scope.$on('mapTransition', function() {
        $scope.data.nextFloorIsHigher = MapService.nextFloorIsHigher;
    });

    $scope.$on('hideIconsChanged', function() {
        $scope.data.hideIconsFood = MapService.hideIconsFood;
        $scope.data.hideIconsCopy = MapService.hideIconsCopy;
        $scope.data.hideIconsSurf = MapService.hideIconsSurf;
        $scope.data.hideIconsToilets = MapService.hideIconsToilets;
        $scope.data.hideIconsElevators = MapService.hideIconsElevators;
        $scope.data.hideIconsRecycle = MapService.hideIconsRecycle;
    });

    $scope.init();

}])


.service('MapService', ['$rootScope','$location','RoomSearchService','$timeout', function($rootScope, $location, RoomSearchService,$timeout) {

    var currentFloor = 3;
    var roomToHighlight = null;
    var self = this;
    var haveToMarkOnOtherFloor = false;
    var nextFloorIsHigher = false;
    var isMovingToHighlightRoom = false;

    var hideIconsFood = false; 
    var hideIconsCopy = false; 
    var hideIconsSurf = false;
    var hideIconsToilets = false;
    var hideIconsElevators = false;
    var hideIconsRecycle = false;


    this.highlightRoom = function(room) {
        this.isMovingToHighlightRoom = true;
        this.roomToHighlight = room;

        if(room.floor != this.currentFloor) {
            $timeout(function() {
                self.haveToMarkOnOtherFloor = true;
                self.switchFloor(room.floor);
            },300);


        } else {
            $timeout(function() {
                $rootScope.$broadcast('hightlightRoomOnSameFloor');
            },300);


        }

    };

    this.dehighlightRoom = function() {
        $rootScope.$broadcast('unhightlightRoom');
    }

    this.switchFloor = function(newFloor) {
        if(this.currentFloor != newFloor) {
            this.nextFloorIsHigher = (newFloor > this.currentFloor );
            $rootScope.$broadcast('mapTransition');
            $location.path('/map/' + newFloor);
        }
    };

    this.setHideIconsFood = function(hideIconsFood) {
        this.hideIconsFood = hideIconsFood;
        $rootScope.$broadcast('hideIconsChanged');
    }

    this.setHideIconsCopy = function(hideIconsCopy) {
        this.hideIconsCopy = hideIconsCopy;
        $rootScope.$broadcast('hideIconsChanged');
    }

    this.setHideIconsSurf = function(hideIconsSurf) {
        this.hideIconsSurf = hideIconsSurf;
        $rootScope.$broadcast('hideIconsChanged');
    }

    this.setHideIconsToilets = function(hideIconsToilets) {
        this.hideIconsToilets = hideIconsToilets;
        $rootScope.$broadcast('hideIconsChanged');
    }

    this.setHideIconsElevators = function(hideIconsElevators) {
        this.hideIconsElevators = hideIconsElevators;
        $rootScope.$broadcast('hideIconsChanged');
    }

    this.setHideIconsRecycle = function(hideIconsRecycle) {
        this.hideIconsRecycle = hideIconsRecycle;
        $rootScope.$broadcast('hideIconsChanged');
    }

}])



.directive('tmMap', function() {
    return {
        restrict: 'E',

        template: '<div ng-include="data.svgUrl" include-replace onload="initSvg()"></div>',
        link: function ($scope, element, attrs) {

        }

    };
});