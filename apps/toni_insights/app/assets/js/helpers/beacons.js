'use strict';

var $ = require('jquery'),
    _ = require('underscore');

window.BeaconManager = ( function() {

  var beaconArray = []; // private
  var eventListeners = [];

  return { // expose publicly

    updateBeacons: function( inBeaconArray ) {
      beaconArray = inBeaconArray;

      // informiere listeners
      eventListeners.forEach( function( inListener ) {
        if ( inListener[ 0 ] === 'update' ) {
          inListener[ 1 ].call( null, beaconArray );
        }
      });
    },

    getBeaconArray: function() {
      return beaconArray;
    },

    addEventListener: function ( inEvent, inCallback ) {
      eventListeners.push( [ inEvent, inCallback ] );
    }

  }

}());

var rooms = {
  '4': {
    '9': {
      'G': [1,6],
      'K': [15,19]
    },
    '10': {
      'H': [1,6],
      'K': [20,22],
    }
  }
};

module.exports = {

  lastBeacon: {},
  roomNames: [],

  getRoomNames: function() {
    return this.roomNames;
  },

  startBeaconSearchStream: function() {
    this.beaconSearchTimer = window.setInterval(_.bind(this.getBeacons, this), 500);
  },

  stopBeaconSearch: function() {
    window.clearTimeout(this.beaconSearchTimer);
  },

  getBeacons: function() {
    var beaconManager = window.BeaconManager;
    var beacons = beaconManager.getBeaconArray();

    /**
     * Test var
     */
    /*var beacons = [
      {
        major: '4',
        minor: '10',
        proximity: 'near',
        rssi: '-50'
      }
    ];*/

    if (beacons.length > 0) {
      this.handleBeacons(beacons);
    }
    else {
      this.roomNames = ['no beacon length'];
    }
  },

  hasBeacons: function() {
    var beaconManager = window.BeaconManager;
    var beacons = beaconManager.getBeaconArray();

    if (beacons.length > 0) {
      return true;
    }

    return false;
  },

  handleBeacons: function(beacons) {

    /**
     * Filter out crappy beacon data
     */
    beacons = beacons.filter(function(beacon) {
      return 'unknown' !== beacon.proximity;
    });

    /**
     * Sort beacons by "nearness"
     */
    beacons = beacons.sort(function(a, b) {
      if ((a.proximity == 'near' || a.proximity == 'immediate') && b.proximity == 'far') {
        return -1;
      }
      else if (a.proximity == 'far' && (b.proximity == 'near' || b.proximity == 'immediate')) {
        return 1;
      }
      /**
       * same proximity
       */
      else if (
        a.proximity == 'far' && b.proximity == 'far'
        || a.proximity == 'near' && b.proximity == 'near'
        || a.proximity == 'immediate' && b.proximity == 'immediate')
      {
        /**
         * check for rssi value
         */
        if (a.rssi >= 0) {
          return 1;
        }
        else if (a.rssi < b.rssi) {
          return -1;
        }
        else if (a.rssi > b.rssi) {
          return 1;
        }
        /**
         * leave it when equal
         */
        return 0;
      }
    });

    this.lastBeacon = {
      major: beacons[0].major,
      minor: beacons[0].minor
    };

    /**
     * Build Room Strings for Search
     */
    if ('undefined' !== typeof rooms[this.lastBeacon.major][this.lastBeacon.minor]) {

      var roomRegion = rooms[this.lastBeacon.major][this.lastBeacon.minor];

      var roomNames = [];

      $.each(roomRegion, _.bind(function(gang, fromTo) {

        var roomStringStart = this.lastBeacon.major + '.' + gang;

        for (var i = fromTo[0]; i <= fromTo[1]; i++) {
          if (i.toString().length == 1) {
            i = "0" + i;
          }
          roomNames.push(roomStringStart + i);
        }

      }, this));

      /**
       * Room string to search are now saved in roomNames
       */
      this.roomNames = roomNames;
    }
  }

}
