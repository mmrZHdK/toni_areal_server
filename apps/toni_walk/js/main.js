$history = [];
$btnHistory = [];
$windowLocation = "";


$( document ).ready( function() {
  
  $( '#done' ).click(function(event) {
    
      
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

/*function PrepareShare()
{
  if($history.length > 1)
    $( '#done' ).show();
  else
    $( '#done' ).hide();
}*/

function PreparePage()
{
  //Possible to go back? (main page?)
  if($history.length > 1)
  {
    //yes, show the back button
    $( '#back' ).show();
    //yes, show the done button
    $( '#done' ).show();
    //lead the way button hide after title page
    $( '.leadtheway' ).hide();
  }  
  else
  {
    //no, hide back button
    $( '#back' ).hide();
    //no, hide back button
    $( '#done' ).hide();
    //lead the way button main page show
    $( '.leadtheway' ).show();
  }
    
 
 //Possible to press done after the main page 
 /* if($history.length > 1)
    //yes, show the done button
    $( '#done' ).show();
  else
    //no, hide done button
    $( '#done' ).hide();*/
 
  //(very hacky, very ugly, hardcoded stuff)  
  $currId = "#" + $('.page').not('#haupt').attr('id')
  
  //the lower part reconstructs saved paths from get params
  $getParam = decodeURIComponent($.urlParam($currId.replace('#', "")));
  if($history.length > 0)
  {
    $lastgetParam = decodeURIComponent($.urlParam($history[$history.length-1].replace('#', "")));
    if($getParam != "null" || $lastgetParam != "null")
    {
      $('.navigation').not("#" + $getParam).remove();
    }
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
    if($btnHistory[i] != undefined)
    {
      $url += $history[i+1].replace('#', "") + "=" + $btnHistory[i].replace('#', "") + '&';
    }
  }
  
  return $url;

}
