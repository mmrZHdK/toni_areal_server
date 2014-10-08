console.log( '=== Beacon Browser ===' );

$( document ).ready( function() {
  console.log( '-- Document Ready' );
  
  window.BeaconManager.addEventListener( 'update', function( inBeacons ) {
    
    console.log( "--> update Event für Beacons: " + inBeacons.count );
    
    var $beaconListe = $( '.beaconliste' );
    $beaconListe.html( '' );
    
    inBeacons.forEach( function( beacon ) {
      console.log( 'beacon:' + beacon );
      $beaconListe.append( $( '<li class="beacon"><span class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</span><span class="signalstaerke">' + beacon.rssi + '</span><div class="clear"></div></li>' ) );
    } );
    
  })
  
} );
