var mapModule = angular.module('mapModule', [ ] )

.controller('MapController', ['$scope','$rootScope','$routeParams','MapService','RoomSearchService', 'ControlBarService', '$window','$timeout', function($scope, $rootScope, $routeParams, MapService, RoomSearchService, ControlBarService,$window, $timeout) {


    $scope.init = function() {
        $scope.data = {};
        $scope.data.svgUrl = 'build/maps/toni_map_floor_' + $routeParams.floor + '.svg?v=1';
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
        $scope.data.zoom = 2.5;
        $scope.data.tempScale = 0.5;

        $rootScope.$broadcast('mapIsInitialized');

    }


    $scope.initSvg = function() {
        $scope.svg = $('#map-pane-' + $scope.data.currentFloor + ' svg');

        $scope.svg.panzoom({
            increment: 0.5,
            maxScale: 15,
            minScale: 0.5,
            //contain: 'invert',
            onPan: $scope.mapMoved,
            onZoom: $scope.mapZoomed
        });

        $scope.snapSvg = Snap('#map-pane-' + $scope.data.currentFloor + ' svg');

        Snap.load("build/pathmeshes/toni_pathmesh_" + $scope.data.currentFloor + ".svg?v=1", function(loadedFragment) {

            
                $scope.snapSvg.append(loadedFragment);

                $scope.markRoomShape();
                $scope.showMyPosition();
                $scope.paintRoute();

                if(MapService.isMovingToHighlightRoom) {
                    $timeout(function() {
                        $scope.moveToRoomShape();
                    },200);
                } else {
                    $scope.svg.panzoom('zoom',0.5);
                    $scope.svg.panzoom('pan',-225,-320);
                }

                if(MapService.isMovingToMyPosition) {
                    $timeout(function() {
                        $scope.moveToMyPosition();
                    },200);
                }
            
        });

        

    };

    $scope.markRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {
            var shape = Snap('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            if(shape != null) {
                shape.addClass('highlighted');
            }
        }
    };

    $scope.unmarkRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {
            var shape = $('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            var shape = Snap('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            if(shape != null) {
                shape.removeClass('highlighted');
                MapService.roomToHighlight = null;
            }
        }
    };

    $scope.moveToRoomShape = function() {
        if(MapService.roomToHighlight !== undefined && MapService.roomToHighlight !== null) {

            $timeout(function() {

                $scope.svg.panzoom('zoom',1.5,{
                    animate: false
                })

                var roomShape = $('[id="'+MapService.roomToHighlight.planRoomNr+'"]');

                if(roomShape.length > 0) {
                    var pos = roomShape.position();

                    var focalPos = {};
                    focalPos.clientX = ($window.innerWidth / 2) - (pos.left + roomShape.get(0).getBoundingClientRect().width/2);
                    focalPos.clientY = ($window.innerHeight / 2) - (pos.top + roomShape.get(0).getBoundingClientRect().height/2);

                    $scope.svg.panzoom("pan", focalPos.clientX, focalPos.clientY, {
                        relative: true,
                        animate: true
                    });
                }
                
            },100);
        }

        MapService.isMovingToHighlightRoom = false;
    }

    $scope.mapMoved = function() {
        if(!MapService.showMyPositionAfterFloorSwitch) {
            ControlBarService.deactivatePositioningButton();
        }
    };

    $scope.mapZoomed = function(e, panzoom, scale) {
        if(!MapService.showMyPositionAfterFloorSwitch) {
            ControlBarService.deactivatePositioningButton();
        }

        if(Math.abs(scale - $scope.data.tempScale) > 0.2 ) {
            $timeout(function() {
                $scope.data.hideRoomLabels = (scale < 1.0);
                $scope.data.hideIconsAll = (scale < 0.6);
            },100);

            $scope.data.tempScale = scale;
        }
    };

    $scope.showMyPosition = function() {
 
        if(MapService.myPosition != undefined && MapService.myPosition.floor == MapService.currentFloor) {
            console.log("SHOWMYPOS");
            if($scope.myPositionCircle === undefined || $scope.myPositionCircle === null) {
                $scope.myPositionCircle = $scope.snapSvg.group();
                var c0 = $scope.myPositionCircle.circle(MapService.myPosition.x, MapService.myPosition.y, 40);
                var c1 = $scope.myPositionCircle.circle(MapService.myPosition.x, MapService.myPosition.y, 10);
                var c2 = $scope.myPositionCircle.circle(MapService.myPosition.x, MapService.myPosition.y, 5);

                $scope.myPositionCircle.attr({ id: 'my-position-circle'});
                c0.addClass('surround');
                c1.addClass('animated infinite my-pos-pulse');
                c2.addClass('animated infinite my-pos-pulse delay');
            } else {
                $scope.myPositionCircle.removeClass('hide');
            }

        }
    }

    $scope.hideMyPosition = function() {
        if($scope.myPositionCircle !== undefined && $scope.myPositionCircle !== null) {
            $scope.myPositionCircle.addClass('hide');
        }
    }

    $scope.moveToMyPosition = function() {

        console.log("MOVE TO POSITION");
        if(MapService.myPosition !== undefined && MapService.myPosition !== null && $scope.myPositionCircle != undefined && $scope.myPositionCircle != null) {

            $timeout(function() {

                $scope.svg.panzoom('zoom',1.5,{
                    animate: false
                })

                var myPos = $('#my-position-circle .surround');

                console.log(myPos);
                if(myPos.length > 0) {
                    var pos = myPos.position();

                    var focalPos = {};
                    focalPos.clientX = ($window.innerWidth / 2) - (pos.left + myPos.get(0).getBoundingClientRect().width/2);
                    focalPos.clientY = ($window.innerHeight / 2) - (pos.top + myPos.get(0).getBoundingClientRect().height/2);

                    console.log("TOPOX" + focalPos.clientX);
                    console.log("TOPOY" + focalPos.clientY);

                    $scope.svg.panzoom("pan", focalPos.clientX, focalPos.clientY, {
                        relative: true,
                        animate: true
                    });
                }

            },100);
        }

        MapService.isMovingToMyPosition = false;
    }


    

    $scope.paintRoute = function() {

        if($scope.lineToRoom !== undefined && $scope.lineToRoom !== null) {
            $scope.lineToRoom.remove();
        }
        
        if($scope.lineToPos !== undefined && $scope.lineToPos !== null) {
            $scope.lineToPos.remove();
        }
        
        console.log("TRY start display route");
        if(MapService.route !== undefined && MapService.route !== null) {
            console.log("start display route");
            var connections = $scope.snapSvg.selectAll('.path-line');
            var arrow = $scope.snapSvg.polygon([0,4, 4,4, 2,0, 0,4]).addClass('arrow-marker').transform('r90');
            var arrowInv = $scope.snapSvg.polygon([0,4, 4,4, 2,0, 0,4]).addClass('arrow-marker arrow-marker-inv').transform('r270');
            var marker = arrow.marker(0,0, 4,4, 0,2);
            var markerInv = arrowInv.marker(0,0, 4,4, 0,2);
            var lastP = null;

            $.each(connections, function(key, connection) {
                connection.removeClass('active');
            });

            for(var i=0; i < MapService.route.length; i++) {

                if(lastP != null) {

                    $.each(connections, function(key, connection) {

                        var connectionId = connection.attr('id');

                        var pathwayV1 = 'l-' + lastP + '-to-' + MapService.route[i];
                        var pathwayV2 = 'l-' + MapService.route[i] + '-to-' + lastP;

                        if(connectionId === pathwayV1 || connectionId === pathwayV2) {
                            connection.addClass('active');

                            if(connectionId === pathwayV1) {
                                connection.attr({ markerStart: marker });    
                            } else {
                                connection.attr({ markerStart: markerInv });
                            }
                        } 
                    });
                }

                lastP = MapService.route[i];
            }


            //PAINT START (POS TO FIRST POINT)
            /*var startP = $('#c-' + MapService.route[0]);
            $scope.lineToPos = $scope.snapSvg.line(MapService.myPosition.x,MapService.myPosition.y,startP.attr('cx'), startP.attr('cy'));
            $scope.lineToPos.addClass('path-line active');*/

            //PAINT END (LAST POINT TO ROOM)
            /*var endP = $('#c-' + MapService.route[MapService.route.length-1]);
            var roomShape = Snap('[id="'+MapService.roomToHighlight.planRoomNr+'"]');
            var roomX =  roomShape.getBBox().cx;
            var roomY =  roomShape.getBBox().cy;

            $scope.lineToRoom = $scope.snapSvg.line(endP.attr('cx'), endP.attr('cy'), roomX, roomY);
            $scope.lineToRoom.addClass('path-line active');*/
        } 
    }

    $scope.$watch('data.zoom', function() {
        if($scope.svg !== undefined) {
            $scope.svg.panzoom('zoom',(1.5/100*$scope.data.zoom) + 0.5);
        }
    });

    $scope.$on('showMyPosition', function() {
        $scope.showMyPosition();
        $scope.moveToMyPosition();
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

    $scope.$on('routeCalculated', function() {
        $scope.paintRoute();
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


.service('MapService', ['$rootScope','$location','RoomSearchService','$timeout','$window', function($rootScope, $location, RoomSearchService,$timeout,$window) {

    var currentFloor = 3;
    var roomToHighlight = null;
    var self = this;
    var showMyPositionAfterFloorSwitch = false;
    var nextFloorIsHigher = false;
    var isMovingToHighlightRoom = false;
    var isMovingToMyPosition = false;

    var hideIconsFood = false;
    var hideIconsCopy = false;
    var hideIconsSurf = false;
    var hideIconsToilets = false;
    var hideIconsElevators = false;
    var hideIconsRecycle = false;
    var route = null;

    var myPosition = {};

    this.highlightRoom = function(room) {
        this.dehighlightRoom();
        this.isMovingToHighlightRoom = true;
        this.roomToHighlight = room;

        if(room.floor != this.currentFloor) {
            $timeout(function() {
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

    this.showMyPosition = function() {

        // GET REAL POSITION DATA HERE
        var myPosition = {};
        myPosition.floor = 3;
        myPosition.x = 145;
        myPosition.y = 861;
        this.myPosition = myPosition;

        console.log("start showing pos");
        console.log(this.myPosition);
        this.isMovingToMyPosition = true;

        if(this.myPosition.floor != this.currentFloor) {
            console.log("switch a floor for pos disp");
            this.showMyPositionAfterFloorSwitch = true;
            this.switchFloor(this.myPosition.floor);
        } else {
            console.log("Pos disp on same floor");
            $rootScope.$broadcast('showMyPosition');
        }
    }

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

    this.findRoute = function(startId) {

        this.showMyPosition();

        console.log("start getting route");

        //ADD REAL POINTS
        var startId = "3-1745-831";
        var endId = this.getRouteEndPoint();
        //var endId = "7-4983.5-256";

        $.get( "http://exohosting.ch/tonipathfinder/index.php?start=" + startId + "&end=" + endId, function( data ) {
            self.route = data.toString().split(',');
            $rootScope.$broadcast('routeCalculated');
            console.log(self.route);
        })
        .fail(function() {
            console.log( "ERROR GETTING ROUTE PATH" );
        });
    }

    this.getRouteEndPoint = function() {
        console.log("GET END");
        var roomShape = Snap('[id="'+this.roomToHighlight.planRoomNr+'"]');

        console.log(roomShape);
        if(roomShape != null) {
            var roomX =  roomShape.getBBox().cx;
            var roomY =  roomShape.getBBox().cy;

            var points = $('.path-point');
            var distances = new Array();

            $.each(points, function(i, point) {
                var distance = {};
                distance.pointId = point.getAttribute('id');
                var dx =  roomX - point.getAttribute('cx');
                var dy = roomY - point.getAttribute('cy');

                distance.distance = Math.sqrt(dx * dx + dy * dy);
                distances.push(distance);
            });

            distances.sort(this.compareDistances);
        }

        var endPointId = distances[0].pointId.substr(2,distances[0].pointId.length);
        console.log("ENDP=" + endPointId);
        return endPointId;
    }

    this.compareDistances = function(distance1, distance2) {
        if (distance1.distance < distance2.distance) {
            return -1;
        }
        if (distance1.distance > distance2.distance) {
            return 1;
        }
        return 0;
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