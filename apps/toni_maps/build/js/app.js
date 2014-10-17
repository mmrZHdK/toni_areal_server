/* JS Custom Scripts - Compressed and Uglified */ 

(function() {

!function(){function resizeScreen(){var height=window.innerHeight?window.innerHeight:$(window).height();$("body").height(height),$("html").height(height),$(".wrapper-all").height(height)}angular.module("helpers",[]).directive("includeReplace",function(){return{require:"ngInclude",restrict:"A",link:function(scope,el){el.replaceWith(el.children())}}}),angular.module("services",[]),angular.module("controlBarModule",[]).controller("ControlBarController",["$scope","MapService","$timeout","ControlBarService","RoomSearchService",function($scope,MapService,$timeout,ControlBarService){$scope.init=function(){$scope.initializing=!0,$scope.data={},$scope.data.room={},$scope.data.floor=0},$scope.toggleSideMenu=function(){ControlBarService.toggleSideMenu()},$scope.closeSideMenu=function(){ControlBarService.closeSideMenu()},$scope.startPositioning=function(){MapService.showMyPosition(),$scope.data.isPositioningMode=!0},$scope.stopPositioning=function(){$scope.data.isPositioningMode=!1},$scope.startRouting=function(){var startId=0,endId=0;MapService.findRoute(startId,endId)},$scope.setFloor=function(floor){$scope.data.floor=floor},$scope.$watch("data.floor",function(){$scope.initializing?$timeout(function(){$scope.initializing=!1}):MapService.switchFloor($scope.data.floor)}),$scope.$on("roomFindingModeStarted",function(){$scope.data.room=ControlBarService.room,$scope.data.roomFindMode=!0}),$scope.$on("roomFindingModeCanceled",function(){$scope.data.room=null,$scope.data.roomFindMode=!1}),$scope.$on("mapIsInitialized",function(){$scope.data.floor=MapService.currentFloor}),$scope.$on("deactivatePositioningButton",function(){$scope.stopPositioning()}),$scope.init()}]).service("ControlBarService",["$rootScope",function($rootScope){this.startRoomFindingMode=function(room){this.room=room,$rootScope.$broadcast("roomFindingModeStarted")},this.cancelRoomFindingMode=function(){$rootScope.$broadcast("roomFindingModeCanceled")},this.toggleSideMenu=function(){this.showSideMenu=!this.showSideMenu,$rootScope.$broadcast("sideMenuChanged")},this.cliseSideMenu=function(){this.showSideMenu=!1,$rootScope.$broadcast("sideMenuChanged")},this.deactivatePositioningButton=function(){$rootScope.$broadcast("deactivatePositioningButton")}}]).directive("tmRoomDisplay",function(){return{restrict:"E",templateUrl:"build/templates/controlbar/templates/roomdisplay.template.html",link:function(){}}}).directive("tmFloorNavigation",function(){return{restrict:"E",templateUrl:"build/templates/controlbar/templates/floornavigation.template.html",link:function(){}}}),angular.module("mapModule",[]).controller("MapController",["$scope","$rootScope","$routeParams","MapService","RoomSearchService","ControlBarService","$window","$timeout",function($scope,$rootScope,$routeParams,MapService,RoomSearchService,ControlBarService,$window,$timeout){$scope.init=function(){$scope.data={},$scope.data.svgUrl="build/maps/toni_map_floor_"+$routeParams.floor+".svg?v=1",MapService.currentFloor=$routeParams.floor,$scope.data.currentFloor=MapService.currentFloor,$scope.data.nextFloorIsHigher=MapService.nextFloorIsHigher,$scope.data.hideRoomLabels=!0,$scope.data.hideIconsAll=!0,$scope.data.hideIconsFood=MapService.hideIconsFood,$scope.data.hideIconsCopy=MapService.hideIconsCopy,$scope.data.hideIconsSurf=MapService.hideIconsSurf,$scope.data.hideIconsToilets=MapService.hideIconsToilets,$scope.data.hideIconsElevators=MapService.hideIconsElevators,$scope.data.hideIconsRecycle=MapService.hideIconsRecycle,$scope.data.zoom=2.5,$scope.data.tempScale=.5,$rootScope.$broadcast("mapIsInitialized")},$scope.initSvg=function(){$scope.svg=$("#map-pane-"+$scope.data.currentFloor+" svg"),$scope.svg.panzoom({increment:.5,maxScale:15,minScale:.5,onPan:$scope.mapMoved,onZoom:$scope.mapZoomed}),$scope.snapSvg=Snap("#map-pane-"+$scope.data.currentFloor+" svg"),Snap.load("build/pathmeshes/toni_pathmesh_"+$scope.data.currentFloor+".svg?v=1",function(loadedFragment){$scope.snapSvg.append(loadedFragment),$scope.markRoomShape(),$scope.showMyPosition(),$scope.paintRoute(),MapService.isMovingToHighlightRoom?$timeout(function(){$scope.moveToRoomShape()},200):($scope.svg.panzoom("zoom",.5),$scope.svg.panzoom("pan",-225,-320)),MapService.isMovingToMyPosition&&$timeout(function(){$scope.moveToMyPosition()},200)})},$scope.markRoomShape=function(){if(void 0!==MapService.roomToHighlight&&null!==MapService.roomToHighlight){var shape=Snap('[id="'+MapService.roomToHighlight.planRoomNr+'"]');null!=shape&&shape.addClass("highlighted")}},$scope.unmarkRoomShape=function(){if(void 0!==MapService.roomToHighlight&&null!==MapService.roomToHighlight){var shape=$('[id="'+MapService.roomToHighlight.planRoomNr+'"]'),shape=Snap('[id="'+MapService.roomToHighlight.planRoomNr+'"]');null!=shape&&(shape.removeClass("highlighted"),MapService.roomToHighlight=null)}},$scope.moveToRoomShape=function(){void 0!==MapService.roomToHighlight&&null!==MapService.roomToHighlight&&$timeout(function(){$scope.svg.panzoom("zoom",1.5,{animate:!1});var roomShape=$('[id="'+MapService.roomToHighlight.planRoomNr+'"]');if(roomShape.length>0){var pos=roomShape.position(),focalPos={};focalPos.clientX=$window.innerWidth/2-(pos.left+roomShape.get(0).getBoundingClientRect().width/2),focalPos.clientY=$window.innerHeight/2-(pos.top+roomShape.get(0).getBoundingClientRect().height/2),$scope.svg.panzoom("pan",focalPos.clientX,focalPos.clientY,{relative:!0,animate:!0})}},100),MapService.isMovingToHighlightRoom=!1},$scope.mapMoved=function(){MapService.showMyPositionAfterFloorSwitch||ControlBarService.deactivatePositioningButton()},$scope.mapZoomed=function(e,panzoom,scale){MapService.showMyPositionAfterFloorSwitch||ControlBarService.deactivatePositioningButton(),Math.abs(scale-$scope.data.tempScale)>.2&&($timeout(function(){$scope.data.hideRoomLabels=1>scale,$scope.data.hideIconsAll=.6>scale},100),$scope.data.tempScale=scale)},$scope.showMyPosition=function(){if(void 0!=MapService.myPosition&&MapService.myPosition.floor==MapService.currentFloor)if(void 0===$scope.myPositionCircle||null===$scope.myPositionCircle){$scope.myPositionCircle=$scope.snapSvg.group();var c0=$scope.myPositionCircle.circle(MapService.myPosition.x,MapService.myPosition.y,40),c1=$scope.myPositionCircle.circle(MapService.myPosition.x,MapService.myPosition.y,10),c2=$scope.myPositionCircle.circle(MapService.myPosition.x,MapService.myPosition.y,5);$scope.myPositionCircle.attr({id:"my-position-circle"}),c0.addClass("surround"),c1.addClass("animated infinite my-pos-pulse"),c2.addClass("animated infinite my-pos-pulse delay")}else $scope.myPositionCircle.removeClass("hide")},$scope.hideMyPosition=function(){void 0!==$scope.myPositionCircle&&null!==$scope.myPositionCircle&&$scope.myPositionCircle.addClass("hide")},$scope.moveToMyPosition=function(){void 0!==MapService.myPosition&&null!==MapService.myPosition&&void 0!=$scope.myPositionCircle&&null!=$scope.myPositionCircle&&$timeout(function(){$scope.svg.panzoom("zoom",1.5,{animate:!1});var myPos=$("#my-position-circle .surround");if(myPos.length>0){var pos=myPos.position(),focalPos={};focalPos.clientX=$window.innerWidth/2-(pos.left+myPos.get(0).getBoundingClientRect().width/2),focalPos.clientY=$window.innerHeight/2-(pos.top+myPos.get(0).getBoundingClientRect().height/2),$scope.svg.panzoom("pan",focalPos.clientX,focalPos.clientY,{relative:!0,animate:!0})}},100),MapService.isMovingToMyPosition=!1},$scope.paintRoute=function(){if(void 0!==$scope.lineToRoom&&null!==$scope.lineToRoom&&$scope.lineToRoom.remove(),void 0!==$scope.lineToPos&&null!==$scope.lineToPos&&$scope.lineToPos.remove(),void 0!==MapService.route&&null!==MapService.route){var connections=$scope.snapSvg.selectAll(".path-line"),arrow=$scope.snapSvg.polygon([0,4,4,4,2,0,0,4]).addClass("arrow-marker").transform("r90"),arrowInv=$scope.snapSvg.polygon([0,4,4,4,2,0,0,4]).addClass("arrow-marker arrow-marker-inv").transform("r270"),marker=arrow.marker(0,0,4,4,0,2),markerInv=arrowInv.marker(0,0,4,4,0,2),lastP=null;$.each(connections,function(key,connection){connection.removeClass("active")});for(var i=0;i<MapService.route.length;i++)null!=lastP&&$.each(connections,function(key,connection){var connectionId=connection.attr("id"),pathwayV1="l-"+lastP+"-to-"+MapService.route[i],pathwayV2="l-"+MapService.route[i]+"-to-"+lastP;(connectionId===pathwayV1||connectionId===pathwayV2)&&(connection.addClass("active"),connection.attr(connectionId===pathwayV1?{markerStart:marker}:{markerStart:markerInv}))}),lastP=MapService.route[i]}},$scope.$watch("data.zoom",function(){void 0!==$scope.svg&&$scope.svg.panzoom("zoom",.015*$scope.data.zoom+.5)}),$scope.$on("showMyPosition",function(){$scope.showMyPosition(),$scope.moveToMyPosition()}),$scope.$on("hightlightRoomOnSameFloor",function(){$scope.markRoomShape(),$scope.moveToRoomShape()}),$scope.$on("unhightlightRoom",function(){$scope.unmarkRoomShape()}),$scope.$on("mapTransition",function(){$scope.data.nextFloorIsHigher=MapService.nextFloorIsHigher}),$scope.$on("routeCalculated",function(){$scope.paintRoute()}),$scope.$on("hideIconsChanged",function(){$scope.data.hideIconsFood=MapService.hideIconsFood,$scope.data.hideIconsCopy=MapService.hideIconsCopy,$scope.data.hideIconsSurf=MapService.hideIconsSurf,$scope.data.hideIconsToilets=MapService.hideIconsToilets,$scope.data.hideIconsElevators=MapService.hideIconsElevators,$scope.data.hideIconsRecycle=MapService.hideIconsRecycle}),$scope.init()}]).service("MapService",["$rootScope","$location","RoomSearchService","$timeout","$window",function($rootScope,$location,RoomSearchService,$timeout){var self=this;this.highlightRoom=function(room){this.dehighlightRoom(),this.isMovingToHighlightRoom=!0,this.roomToHighlight=room,room.floor!=this.currentFloor?$timeout(function(){self.switchFloor(room.floor)},300):$timeout(function(){$rootScope.$broadcast("hightlightRoomOnSameFloor")},300)},this.dehighlightRoom=function(){$rootScope.$broadcast("unhightlightRoom")},this.switchFloor=function(newFloor){this.currentFloor!=newFloor&&(this.nextFloorIsHigher=newFloor>this.currentFloor,$rootScope.$broadcast("mapTransition"),$location.path("/map/"+newFloor))},this.showMyPosition=function(){var myPosition={};myPosition.floor=3,myPosition.x=145,myPosition.y=861,this.myPosition=myPosition,this.isMovingToMyPosition=!0,this.myPosition.floor!=this.currentFloor?(this.showMyPositionAfterFloorSwitch=!0,this.switchFloor(this.myPosition.floor)):$rootScope.$broadcast("showMyPosition")},this.setHideIconsFood=function(hideIconsFood){this.hideIconsFood=hideIconsFood,$rootScope.$broadcast("hideIconsChanged")},this.setHideIconsCopy=function(hideIconsCopy){this.hideIconsCopy=hideIconsCopy,$rootScope.$broadcast("hideIconsChanged")},this.setHideIconsSurf=function(hideIconsSurf){this.hideIconsSurf=hideIconsSurf,$rootScope.$broadcast("hideIconsChanged")},this.setHideIconsToilets=function(hideIconsToilets){this.hideIconsToilets=hideIconsToilets,$rootScope.$broadcast("hideIconsChanged")},this.setHideIconsElevators=function(hideIconsElevators){this.hideIconsElevators=hideIconsElevators,$rootScope.$broadcast("hideIconsChanged")},this.setHideIconsRecycle=function(hideIconsRecycle){this.hideIconsRecycle=hideIconsRecycle,$rootScope.$broadcast("hideIconsChanged")},this.findRoute=function(startId){this.showMyPosition();var startId="3-1745-831",endId=this.getRouteEndPoint();$.get("http://exohosting.ch/tonipathfinder/index.php?start="+startId+"&end="+endId,function(data){self.route=data.toString().split(","),$rootScope.$broadcast("routeCalculated")}).fail(function(){})},this.getRouteEndPoint=function(){var roomShape=Snap('[id="'+this.roomToHighlight.planRoomNr+'"]');if(null!=roomShape){var roomX=roomShape.getBBox().cx,roomY=roomShape.getBBox().cy,points=$(".path-point"),distances=new Array;$.each(points,function(i,point){var distance={};distance.pointId=point.getAttribute("id");var dx=roomX-point.getAttribute("cx"),dy=roomY-point.getAttribute("cy");distance.distance=Math.sqrt(dx*dx+dy*dy),distances.push(distance)}),distances.sort(this.compareDistances)}var endPointId=distances[0].pointId.substr(2,distances[0].pointId.length);return endPointId},this.compareDistances=function(distance1,distance2){return distance1.distance<distance2.distance?-1:distance1.distance>distance2.distance?1:0}}]).directive("tmMap",function(){return{restrict:"E",template:'<div ng-include="data.svgUrl" include-replace onload="initSvg()"></div>',link:function(){}}}),angular.module("roomSearchModule",["ngResource","ng-iscroll"]).controller("RoomSearchController",["$scope","$http","$resource","RoomSearchService","MapService","$timeout","$window","ControlBarService",function($scope,$http,$resource,RoomSearchService,MapService,$timeout,$window,ControlBarService){$scope.init=function(){$scope.resultlistheight={height:$window.innerHeight-85+"px"},$scope.roomFindingActive=!1,$scope.roomSearchQuery="",$scope.$parent.myScrollOptions={"room-search-result-scroll-pane":{snap:!1,click:!0,onScrollEnd:function(){}}}},$scope.loadRoomSearchResults=function(){RoomSearchService.searchRooms($scope.roomSearchQuery)},$scope.magnifierClicked=function(){$("input#room-search-box").focus()},$scope.roomSearchHasFocus=function(){RoomSearchService.setSearchActive(!0),$scope.resizeResultList()},$scope.roomSearchLoseFocus=function(){$scope.roomSearchQuery.length<=0?(RoomSearchService.setSearchActive(!1),$scope.resizeResultList()):$scope.roomSearchQuery="",RoomSearchService.rooms={},RoomSearchService.updateRoomList()},$scope.deactivateInputField=function(){$scope.resizeResultList()},$scope.selectRoom=function(room){RoomSearchService.setSearchActive(!1),RoomSearchService.setFindingActive(!0),MapService.highlightRoom(room),ControlBarService.startRoomFindingMode(room),$scope.roomSearchQuery=null!=room.additionalDescription&&room.additionalDescription.length>0?room.additionalDescription:room.signalRoomNr,$scope.isSpecialRoom=null!=room.additionalDescription&&room.additionalDescription.length>0},$scope.roomFindCancel=function(){RoomSearchService.roomSearchActive&&RoomSearchService.roomFindingActive?$scope.roomSearchLoseFocus():(RoomSearchService.setFindingActive(!1),RoomSearchService.setSearchActive(!1),MapService.dehighlightRoom(),ControlBarService.cancelRoomFindingMode())},$scope.resizeResultList=function(){$scope.resultlistheight={height:$window.innerHeight-85+"px"},$scope.$parent.myScroll["room-search-result-scroll-pane"].refresh()},$scope.$on("roomListUpdated",function(){$scope.rooms=RoomSearchService.rooms,$scope.showList=$scope.rooms.length>0,$scope.showList&&$timeout(function(){$scope.$parent.myScroll["room-search-result-scroll-pane"].refresh()},0)}),$scope.$on("roomSearchActiveChanged",function(){$scope.searchActive=RoomSearchService.roomSearchActive,$scope.searchActive||$("#room-search-box").blur()}),$scope.$on("roomFindingActiveChanged",function(){$scope.findingActive=RoomSearchService.roomFindingActive,$scope.findingActive||($scope.roomSearchQuery="")}),$scope.init()}]).service("RoomSearchService",["$http","$resource","$rootScope",function($http,$resource,$rootScope){var self=this;$http.defaults.useXDomain=!0,this.searchRooms=function(roomSearchQuery){if(roomSearchQuery.length>=3){var cleanedRoomSearchQuery=roomSearchQuery.split(".").join("");cleanedRoomSearchQuery=cleanedRoomSearchQuery.replace(/\s/g,"");var roomService=$resource("http://exohosting.ch/toniareal/api/v1/rooms/all/:searchQuery",{searchQuery:"@searchQuery"});roomService.query({searchQuery:cleanedRoomSearchQuery}).$promise.then(function(rooms){self.rooms=rooms,self.isFavourites=!1,self.updateRoomList()})}else if(0==roomSearchQuery.length){var roomService=$resource("http://exohosting.ch/toniareal/api/v1/rooms/favourites",{});roomService.query().$promise.then(function(rooms){self.rooms=rooms,self.isFavourites=!0,self.updateRoomList()})}else this.rooms={},this.isFavourites=!1,this.updateRoomList()},this.updateRoomList=function(){$rootScope.$broadcast("roomListUpdated")},this.setSearchActive=function(active){this.roomSearchActive=active,$rootScope.$broadcast("roomSearchActiveChanged")},this.setFindingActive=function(active){this.roomFindingActive=active,$rootScope.$broadcast("roomFindingActiveChanged")}}]).directive("tmRoomSearchResults",function(){return{restrict:"E",templateUrl:"build/templates/roomsearch/templates/results.template.html",link:function(){}}}).directive("tmRoomSearchResultItem",function(){return{restrict:"E",templateUrl:"build/templates/roomsearch/templates/resultitem.template.html"}}).directive("tmRoomSearchBox",function(){return{restrict:"E",templateUrl:"build/templates/roomsearch/templates/searchbox.template.html"}}),angular.module("sideMenuModule",[]).controller("SideMenuController",["$scope","ControlBarService","MapService",function($scope,ControlBarService,MapService){$scope.init=function(){$scope.data={},$scope.data.showSideMenu=!1,$scope.data.showIconsFood=!MapService.hideIconsFood,$scope.data.showIconsCopy=!MapService.hideIconsCopy,$scope.data.showIconsSurf=!MapService.hideIconsSurf,$scope.data.showIconsToilets=!MapService.hideIconsToilets,$scope.data.showIconsElevators=!MapService.hideIconsElevators,$scope.data.showIconsRecycle=!MapService.hideIconsRecycle},$scope.$on("sideMenuChanged",function(){$scope.data.showSideMenu=ControlBarService.showSideMenu,$scope.data.showSideMenu?$("#wrapper-all").addClass("side-menu-offset"):$("#wrapper-all").removeClass("side-menu-offset")}),$scope.$watch("data.showIconsFood",function(){MapService.setHideIconsFood(!$scope.data.showIconsFood)}),$scope.$watch("data.showIconsCopy",function(){MapService.setHideIconsCopy(!$scope.data.showIconsCopy)}),$scope.$watch("data.showIconsSurf",function(){MapService.setHideIconsSurf(!$scope.data.showIconsSurf)}),$scope.$watch("data.showIconsToilets",function(){MapService.setHideIconsToilets(!$scope.data.showIconsToilets)}),$scope.$watch("data.showIconsElevators",function(){MapService.setHideIconsElevators(!$scope.data.showIconsElevators)}),$scope.$watch("data.showIconsRecycle",function(){MapService.setHideIconsRecycle(!$scope.data.showIconsRecycle)}),$scope.init()}]).directive("tmSideMenu",function(){return{restrict:"E",templateUrl:"build/templates/sidemenu/templates/sidemenu.template.html",link:function(){}}});$(document).ready(function(){resizeScreen(),$(window).resize(function(){resizeScreen()}),document.addEventListener("touchmove",function(event){event.preventDefault()})});var app=new angular.module("toniMapsModule",["mapModule","roomSearchModule","controlBarModule","sideMenuModule","ngRoute","ngAnimate","ngAnimate-animate.css","helpers","nouislider","NgSwitchery"]);app.config(["$routeProvider",function($routeProvider){$routeProvider.when("/map/:floor",{templateUrl:"build/views/map.view.html",controller:"MapController"}).otherwise({redirectTo:"/map/3"})}]).controller("WrapperController",["$scope","ControlBarService",function($scope,ControlBarService){$scope.toggleSideMenu=function(){ControlBarService.toggleSideMenu()}}])}();

})();