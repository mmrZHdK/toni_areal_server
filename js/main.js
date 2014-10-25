$( document ).ready( function() {
  // Start des Programme, Dokument geladen
  
  var timerID = window.setTimeout( function() {
    $( '#about_text' ).hide( 500 );
  }, 3000 );
  
  $( '#about' ).on( 'click', function() {
    // Klick auf die ABOUT Taste
    $( '#about_text' ).toggle( 300 );
  } );
  
/*
  $( '#info' ).on( 'click', function() {
    // Klick auf die INFO Taste
  } );
*/
  
} );
