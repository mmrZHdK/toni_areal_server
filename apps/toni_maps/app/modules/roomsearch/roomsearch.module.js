var roomSearchModule = angular.module('roomSearchModule', ['ngResource','ng-iscroll'] )

.controller('RoomSearchController', ['$scope','$http', '$resource','RoomSearchService', 'MapService', '$timeout', '$window', 'ControlBarService', function($scope, $http, $resource, RoomSearchService, MapService, $timeout, $window, ControlBarService) {

    $scope.init = function() {
        $scope.resultlistheight = { height: $window.innerHeight - 85 + 'px'};
        $scope.roomFindingActive = false;
        $scope.roomSearchQuery = '';

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


    $scope.magnifierClicked = function() {
        $('input#room-search-box').focus();
    }

    $scope.roomSearchHasFocus = function() {

        RoomSearchService.setSearchActive(true);
        $scope.resizeResultList();
    }

    $scope.roomSearchLoseFocus = function() {
        if($scope.roomSearchQuery.length <= 0) {
            RoomSearchService.setSearchActive(false);
            $scope.resizeResultList();
        } else {
            $scope.roomSearchQuery = '';
        }

        RoomSearchService.rooms = {};
        RoomSearchService.updateRoomList();

    }

    $scope.deactivateInputField = function() {
        $scope.resizeResultList();
    }

    $scope.selectRoom = function(room) {
        RoomSearchService.setSearchActive(false);
        RoomSearchService.setFindingActive(true);
        MapService.highlightRoom(room);
        ControlBarService.startRoomFindingMode(room);
        $scope.roomSearchQuery = (room.additionalDescription != null && room.additionalDescription.length > 0 ? room.additionalDescription : room.signalRoomNr);
        $scope.isSpecialRoom = (room.additionalDescription != null && room.additionalDescription.length > 0);
    };

    $scope.roomFindCancel = function() {

        if(RoomSearchService.roomSearchActive && RoomSearchService.roomFindingActive) {
            $scope.roomSearchLoseFocus();
        } else {
            RoomSearchService.setFindingActive(false);
            RoomSearchService.setSearchActive(false);
            MapService.dehighlightRoom();
            ControlBarService.cancelRoomFindingMode();
        }
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

            var cleanedRoomSearchQuery = roomSearchQuery.split('.').join('');;
            cleanedRoomSearchQuery = cleanedRoomSearchQuery.replace(/\s/g, '');
            console.log(cleanedRoomSearchQuery);
            var roomService = $resource("http://exohosting.ch/toniareal/api/v1/rooms/all/:searchQuery", {searchQuery: "@searchQuery"});
            roomService.query({searchQuery:cleanedRoomSearchQuery}).$promise.then(function(rooms) {
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
        templateUrl: 'build/templates/roomsearch/templates/results.template.html',

        link: function ($scope, element, attrs) {

        }

    };
})

.directive('tmRoomSearchResultItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/roomsearch/templates/resultitem.template.html'

    };
})

.directive('tmRoomSearchBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'build/templates/roomsearch/templates/searchbox.template.html'



    };
});