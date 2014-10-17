
$history = [];
$btnHistory = [];
$windowLocation = "";


$( document ).ready( function() {
  
  $( document ).keypress(function(event) {
    var code = event.keyCode || event.which;
    
      prompt("URL to give to your friend", SpitOutURL());
  });

  $windowLocation = window.location.href;
  //assign back button functionality
  $('#back').click(BackPage);
  $('#back').hide();
  //load initial page
    $('.page#haupt').load( '1.html #main', function( e ) {
    PreparePage();
    //Set last page to main page
    $history.push('#main');
    });
} );



function PreparePage()
{
  //Possible to go back? (main page?)
  if($history.length > 1)
    //yes, show the back button
    $( '#back' ).show();
  else
    //no, hide back button
    $( '#back' ).hide();
    
  //(very hacky, very ugly, hardcoded stuff)  
  $currId = "#" + $('.page').not('#haupt').attr('id')
  
  //the lower part reconstructs saved paths from get params
  $getParam = decodeURIComponent($.urlParam($currId.replace('#', "")));
  if($getParam != "null")
  {
    $('.navigation').not("#" + $getParam).remove();
  }

  
  //Assign "load next page" functionality to all the buttons
  $('.navigation').click(function(e){
      //find out which page the button loads (could be done better)
      $next = $('.nextpage', this).html();
      //remember the path taken
      $history.push($currId);
      $btnHistory.push($(this).attr('id'));
      //when clicked load next
      $('.page#haupt').load( '1.html ' + $next, function( e ) {
        //prepare the newly loaded content
        PreparePage();
    });
  });
}

function BackPage()
{
  
  //no history?
  if($history.length > 0)
  {
    $btnHistory.pop();
    //load the last page
    $('.page#haupt').load( '1.html ' + $history.pop(), function( e ) {
      //prepare newly loaded content
      PreparePage();
    });
  }
  else
  {
    //load the main page
    $('.page#haupt').load( '1.html #main', function( e ) {
      //prepare newly loaded content
      PreparePage();
    });
  }
}

//to get GET params
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^#&]*)').exec($windowLocation);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function SpitOutURL()
{
  
  $url = window.location.href + "?";
  for (var i = 0; i < $btnHistory.length; i++) {
    $url += $history[i].replace('#', "") + "=" + $btnHistory[i].replace('#', "") + '&';
  }
  
  return $url;

}
  






   



























 /* // Erzeuge neue 'page' Section
  $seite = $( '<section class="page out_right" id="treppeToni"></section>' );
  $( '.page#haupt' ).after( $seite );

  // Binde KlickHandler an die Liste
$( '.list' ).on( 'click', 'li', function( e ) {
    console.log( '> click @ li element' );

    // Lade Detail-Seite, slide herein
    $seite.load( '1.html #treppeToni_inhalt', function( e ) {
      console.log( '> complete @ $seite.load' );
      // Seite ist geladen worden, starte Slide Animation
      $seite.removeClass( 'out_right' );
      $( '.page#haupt' ).addClass( 'out_left' );
      $( '.backbutton#back' ).show();
    } );
    
  } );

  // Binde KlickHandler an die Menutaste
  $( '.footer' ).on( 'click', '.backbutton#back', function( e ) {
    console.log( '> click @ .backbutton#back' );
    
    // Schiebe Seiten wieder raus
    $( '.page#haupt' ).removeClass( 'out_left' );
    $( '.page#treppeToni' ).addClass( 'out_right' );
    $( '.backbutton#back' ).hide();
  } );*/
  






   