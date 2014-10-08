console.log( '--- Start BeaconManager Installation ---' );

window.BeaconManager = ( function() {
    var beaconArray = []; //private
    
    return { //exposed to public
      
      updateBeacons: function( inBeaconArray ) {
        beaconArray = inBeaconArray;
        
        console.log( "--> updateBeacons: " + beaconArray.count );
        
        $beaconListe = $( '.beaconliste' );
        $beaconListe.html('');
        
        beaconArray.forEach( function( beacon ) {
          console.log( 'beacon:' + beacon );
          $beaconListe.append( $( '<li class="beacon"><span class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</span><span class="signalstaerke">' + beacon.rssi + '</span><div class="clear"></div></li>' ) );
        } );
      },
      
      getBeaconArray: function() {
        return beaconArray;
      }
    }
}());

console.log( 'ready?:' + ( window.BeaconManager !== undefined ) );
console.log( '--- End BeaconManager Installation ---' );
