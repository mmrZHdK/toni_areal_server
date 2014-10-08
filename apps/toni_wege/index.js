console.log( '=== Toni Wege ===' );

var aktuellerKnoten = 301;
var letzterKnoten = null;

function geheZuKnoten( inKnoten ) {
  letzterKnoten = aktuellerKnoten;
  aktuellerKnoten = inKnoten;
  
  fuelleKnoten( aktuellerKnoten );
}

function fuelleKnoten( inKnoten ) {
  var $knotenDiv = $( '.knoten' );
  $knotenDiv.find( '.nummer' ).html( 'Knoten ' + inKnoten );
  
  var $nachbarListe = $knotenDiv.find( 'ul' );
  $nachbarListe.html( '' );
  
  var nachbarn = window.ToniGraph.gibNachbarn( inKnoten );
  console.log( "-- nachbarn:" + nachbarn );
  nachbarn.forEach( function( nachbar ) {
    var $nachbarLi = $( '<li><a href="#" class="weg" id="' + nachbar + '">zu ' + nachbar + '</a></li>' );
    $nachbarListe.append( $nachbarLi );
    if ( nachbar === letzterKnoten ) {
      $nachbarLi.find( 'a' ).addClass( 'zurueck' );
    }
    
    $nachbarLi.on( 'click', 'a', function( e ) {
      var clickNumber = Number( $( this ).attr( 'id' ) );
      console.log( "-- zu:" + clickNumber );
      geheZuKnoten( clickNumber );
    } );
  } );
  $nachbarListe.append( $( '<li class="clear"></li>' ) );
}

$( document ).ready( function() {
  console.log( '-- Document Ready' );
  
  fuelleKnoten( aktuellerKnoten );
} );
