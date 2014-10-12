$( document ).ready( function() {
  console.log( "Hallo los geht's!" );
  
  // Binde KlickHandler an die Liste
  $( '.list' ).on( 'click', 'li', function( e ) {
    console.log( '> click @ li element' );
    
    // Erzeuge neue 'page' Section
    $seite = $( '<section class="page out_right" id="detail"></section>' );
    $( '.page#haupt' ).after( $seite );
    
    // Lade Detail-Seite, slide herein
    $seite.load( 'detail.html #detail_inhalt', function( e ) {
      console.log( '> complete @ $seite.load' );
      // Seite ist geladen worden, starte Slide Animation
      $seite.removeClass( 'out_right' );
      $( '.page#haupt' ).addClass( 'out_left' );
      $( '.menubutton#back' ).show();
    } );
    
  } );
  
  // Binde KlickHandler an die Menutaste
  $( '.titlebar' ).on( 'click', '.menubutton#back', function( e ) {
    console.log( '> click @ .menubutton#back' );
    
    // Schiebe Seiten wieder raus
    $( '.page#haupt' ).removeClass( 'out_left' );
    $( '.page#detail' ).addClass( 'out_right' );
    $( '.menubutton#back' ).hide();
  } );
  
} );
