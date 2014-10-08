console.log( '--- BeaconManager ---' );

window.BeaconManager = {
  updateBeacons: function ( beaconArray ) {
    console.log( "--> updateBeacons: " + beaconArray.count );
    
    $beaconListe = $( '.beaconliste' );
    $beaconListe.html('');
    
    beaconArray.forEach( function( beacon ) {
      console.log( 'beacon:' + beacon );
      $beaconListe.append( $( '<li class="beacon"><span class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</span><span class="signalstaerke">' + beacon.rssi + '</span><div class="clear"></div></li>' ) );
    } );
  }
}

console.log( 'ok? ' + window.BeaconManager );
