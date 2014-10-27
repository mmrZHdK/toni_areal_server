'use strict';

if (typeof console  != "undefined")
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function() {};

console.log = function(message) {
    console.olog(message);
    $('#debugDiv').append('<p>' + message + '</p>');
};
console.error = console.debug = console.info =  console.log


window.BeaconManager = ( function() {
    var beaconArray = []; //private
    var eventListeners = [];

    return { //exposed to public

      updateBeacons: function( inBeaconArray ) {
        beaconArray = inBeaconArray;

        // informiere Listeners
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

var getBeacons = function() {

  var beaconManager = window.BeaconManager;
  var beacons = beaconManager.getBeaconArray();

  if (beacons.length > 0) {
    handleBeacons(beacons);
  }
  else {
    $('#debugDiv').html('noch keine Daten...');
  }

};

var lastBeacon = {};

var rooms = {
  "4": {
    "9": {
      "G": [1,6],
      "K": [15,19]
    },
    "10": {
      "H": [1,6],
      "K": [20,22],
    }
  }
};

var handleBeacons = function(beacons) {

  var $output = $('#debugDiv');

  $output.html('');
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

  lastBeacon = {
    major: beacons[0].major,
    minor: beacons[0].minor
  };


  if (beacons.length < 1) {
    $output.append('Kein Bacon heute!');
  }

  beacons.forEach(function (beacon) {
    $output.append('<li>Last Beacon: ' + lastBeacon.major + '.' + lastBeacon.minor + '</li>')
    $output.append(
      $( '<li><div class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</div><div class="signalstaerke">' + beacon.rssi + '</div><div class="balken ' + beacon.proximity + '" style="width:' + ( 100 + beacon.rssi ) + '%">&nbsp;</div></li>' ) );
      //console.log('Major: ' + beacon.major + ' | Minor: ' + beacon.minor + ' | Signalstärke: ' + beacon.rssi + ' | Proximity' + beacon.proximity);
  });

  if ('undefined' !== typeof rooms[lastBeacon.major][lastBeacon.minor]) {

    /**
     * Build Room Strings to Search
     */

    var roomRegion = rooms[lastBeacon.major][lastBeacon.minor];

    var roomNames = [];

    $.each(roomRegion, function(gang, fromTo) {

      var roomStringStart = lastBeacon.major + '.' + gang;

      for (var i = fromTo[0]; i <= fromTo[1]; i++) {
        if (i.toString().length == 1) {
          i = "0" + i;
        }
        roomNames.push(roomStringStart + i);
      }

    });

    $output.append('<li>Rooms: ' + roomNames.join(', '));
  }

};

$(document).ready(function() {
  console.log( 'BeaconManagerReady:' + ( window.BeaconManager !== undefined ) );
  window.setInterval(getBeacons, 1000);
});
