console.log( '=== Beacon Browser ===' );

$( document ).ready( function() {
  console.log( '-- Document Ready' );
  
  var bbBeacons = [];
  var $beaconListe = $( '.beaconliste' );
  
  var timerID = window.setTimeout( function() {
    $( '#toll' ).hide();
    $( '#mist' ).show();
  }, 8000 );
  
  window.BeaconManager.addEventListener( 'update', function( inBeacons ) {
    
    console.log( "--> update Event für Beacons: " + inBeacons.count );
    
    $beaconListe.html( '' );
    
    inBeacons.forEach( function( beacon ) {
      
    } );
    inBeacons.forEach( function( beacon ) {
      console.log( 'beacon:' + beacon );
      $beaconListe.append( $( '<li class="beacon"><div class="ident">' + beacon.major + '.Stock / Beacon ' + beacon.minor + '</div><div class="signalstaerke">' + beacon.rssi + '</div><div class="balken ' + beacon.proximity + '" style="width:' + ( 100 + beacon.rssi ) + '%">&nbsp;</div></li>' ) );
    } );
    
    if ( timerID !== null ) {
      window.clearTimeout( timerID );
      timerID = null;
    }
  })
  
} );
