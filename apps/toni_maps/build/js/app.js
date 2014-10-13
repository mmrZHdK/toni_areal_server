(function() {

var helpers = angular.module('helpers',[])

.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
var services = angular.module('services',[]);
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
var roomSearchModule = angular.module('roomSearchModule', ['ngResource','ng-iscroll'] )

.controller('RoomSearchController', ['$scope','$http', '$resource','RoomSearchService', 'MapService', '$timeout', '$window', 'ControlBarService', function($scope, $http, $resource, RoomSearchService, MapService, $timeout, $window, ControlBarService) {

    $scope.init = function() {
        $scope.resultlistheight = { height: $window.innerHeight - 85 + 'px'};
        $scope.roomFindingActive = false;

        $scope.$parent.myScrollOptions = {
            'room-search-result-scroll-pane': {
                snap: false,
                click: true,
                onScrollEnd: function () {
                   
                }
            }
        };
    };

    $scope.loadRoomSearchResults = function() {
        RoomSearchService.searchRooms($scope.roomSearchQuery);
    }


    $scope.roomSearchHasFocus = function() {
        RoomSearchService.setSearchActive(true);
        $scope.resizeResultList();
    }

    $scope.roomSearchLoseFocus = function() { 
        RoomSearchService.setSearchActive(false);
        $scope.resizeResultList();
    }

    $scope.deactivateInputField = function() { 
        $scope.resizeResultList();
    }

    $scope.selectRoom = function(room) {
        RoomSearchService.setSearchActive(false);
        RoomSearchService.setFindingActive(true);
        MapService.highlightRoom(room);
        ControlBarService.startRoomFindingMode(room);
        $scope.roomSearchQuery = room.signalRoomNr;
    };

    $scope.roomFindCancel = function() {
        RoomSearchService.setFindingActive(false);
        RoomSearchService.setSearchActive(false);
        MapService.dehighlightRoom();
        ControlBarService.cancelRoomFindingMode();
    }

    $scope.resizeResultList = function() {
        $scope.resultlistheight = { height: $window.innerHeight - 85 + 'px'};
        $scope.$parent.myScroll['room-search-result-scroll-pane'].refresh();
    }


    $scope.$on('roomListUpdated', function() {

        $scope.rooms = RoomSearchService.rooms;
        $scope.showList = ($scope.rooms.length > 0);

        if($scope.showList) {
            $timeout(function() {
                $scope.$parent.myScroll['room-search-result-scroll-pane'].refresh();
            },0);
        }
    });

    $scope.$on('roomSearchActiveChanged', function() {
        $scope.searchActive = RoomSearchService.roomSearchActive;

        if(!$scope.searchActive) {
            $('#room-search-box').blur();
        } else {
            ControlBarService.closeFloorFlyout();
        }
    });

    $scope.$on('roomFindingActiveChanged', function() {
        $scope.findingActive = RoomSearchService.roomFindingActive;

        if(!$scope.findingActive) {
            $scope.roomSearchQuery = '';
        }
    });

    $scope.init();

}])

.service('RoomSearchService',['$http', '$resource', '$rootScope' , function($http, $resource, $rootScope) {

    var rooms = {};
    var self = this;
    var roomSearchActive = false;
    var roomFindingActive = false;
    var isFavourites = false;
    $http.defaults.useXDomain = true;

    this.searchRooms = function(roomSearchQuery) {
        if(roomSearchQuery.length >= 3) {
            var roomService = $resource("http://exohosting.ch/toniareal/api/v1/rooms/all/:searchQuery", {searchQuery: "@searchQuery"});
            roomService.query({searchQuery:roomSearchQuery}).$promise.then(function(rooms) {
                self.rooms = rooms;
                self.isFavourites = false;
                self.updateRoomList();
            });
        } else {
            if(roomSearchQuery.length == 0) {
                //Get Favourites
                var roomService = $resource("http://exohosting.ch/toniareal/api/v1/rooms/favourites", {});
                roomService.query().$promise.then(function(rooms) {
                    self.rooms = rooms;
                    self.isFavourites = true;
                    self.updateRoomList();
                });
            } else {
                this.rooms = {};
                this.isFavourites = false;
                this.updateRoomList();
            }
        }
    };

    this.updateRoomList = function() {
        $rootScope.$broadcast('roomListUpdated');
    };

    this.setSearchActive = function(active) {
        this.roomSearchActive = active;
        $rootScope.$broadcast('roomSearchActiveChanged');
    };

    this.setFindingActive = function(active) {
        this.roomFindingActive = active;
        $rootScope.$broadcast('roomFindingActiveChanged');
    };

}])

.directive('tmRoomSearchResults', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/roomSearch/templates/results.template.html',

        link: function ($scope, element, attrs) {

        }

    };
})

.directive('tmRoomSearchResultItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/roomSearch/templates/resultitem.template.html'

    };
})

.directive('tmRoomSearchBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/roomSearch/templates/searchbox.template.html'



    };
});
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

})();