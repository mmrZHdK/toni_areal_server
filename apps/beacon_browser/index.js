console.log( '=== Beacon Browser ===' );

$( document ).ready( function() {
  console.log( '-- Document Ready' );
  
  window.BeaconManager.addEventListener( 'update', function( inBeacons ) {
    
    console.log( "--> update Event für Beacons: " + inBeacons.count );
    
    var $beaconListe = $( '.beaconliste' );
    $beaconListe.html( '' );
    
    inBeacons.forEach( function( beacon ) {
      console.log( 'beacon:' + beacon );
      $beaconListe.append( $( '<li class="beacon"><div class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</div><div class="signalstaerke">' + beacon.rssi + '</div><div class="balken ' + beacon.proximity + '" style="width:' + ( 100 + beacon.rssi ) + '%">&nbsp;</div></li>' ) );
    } );
    
  })
  
  window.BeaconManager.updateBeacons( [
        { major:3, minor:12, proximity:'far', rssi:-72 },
        { major:3, minor:14, proximity:'near', rssi:-61 }
  ] );
} );
