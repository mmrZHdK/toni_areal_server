// function f_page_slide( e ) {
//   console.log( '> complete @ $seite.load' );
//   // Seite ist geladen worden, starte Slide Animation
//   $seite.removeClass( 'out_right' );
//   $( '.page#haupt' ).addClass( 'out_left' );
//   $( '.menubutton#back' ).show();
// }

// function f_page_slide_back( e ) {
//   console.log( '> complete @ $seite.load' );
//   // Seite ist geladen worden, starte Slide Animation
//   $( '.page#detail' ).addClass( 'out_right' );
//   $( '.page#haupt' ).removeClass( 'out_left' );
//   $( '.menubutton#back' ).hide();
// }

// function f_click_liste( e ) {
//   console.log( '> click @ li element' );
//   console.log( 'parameter e:' + e );
  
//   // Erzeuge neue 'page' Section
//   $seite = $( '<section class="page out_right" id="detail"></section>' );
//   $( '.page#haupt' ).after( $seite );
  
//   // Lade Detail-Seite, slide herein
//   $seite.load( 'detail.html #detail_inhalt', f_page_slide );
// }


$( document ).ready( function() {
  var screenWidth = $(window).width();
  
  // // Binde KlickHandler an die Liste
  // var $list, $titlebar;
  // $list = $( '.list' );
  // $list.on( 'click', 'li', f_click_liste );
  
  // // Binde KlickHandler an die Menutaste
  // $titlebar = $( '.titlebar' );
  // $titlebar.on( 'click', '.menubutton#back', f_page_slide_back );

  var currentSlide = false;

  $('#photoIcon').click(function() {
    
    $('.parent').animate({
      left: 0
    }, 400);
    currentSlide = 1;
  });

    $('#mangelIcon').click(function() {
    
    $('.parent').animate({
      left: -screenWidth*1
    }, 400);
    currentSlide = 2;
  });
  
      $('#locationIcon').click(function() {
    
    $('.parent').animate({
      left: -screenWidth*2
    }, 400);
    currentSlide = 3;
  });

      $('#nameIcon').click(function() {
    console.log($('.parent'));
    $('.parent').animate({
      left: -screenWidth*3
    }, 400);
    currentSlide = 4;
  });  

      $('#sendIcon').click(function() {
    
    $('.parent').animate({
      left: -screenWidth*4
    }, 400);
    currentSlide = 5;
  });

$(window).on('resize', windowResize);
function windowResize() {
  screenWidth = $(window).width();
  if (currentSlide) {
    $('.parent').css('left', '-' + (screenWidth * currentSlide) + 'px');
  }
}

// u = uploader
var u = $('#file');
var imageSelected = false;

u.on('change', preview);
function preview() {
  // check for old browsers
  if (typeof window.FileReader != 'undefined' && typeof u[0].files != 'undefined') {
    // p = preview
    var p = $('#imagepreview');

    // clear preview area
    p.html('').hide();

    // i = image
    var i = u[0].files[0];
    // check for image
    // f = filter
    var f = /^(image\/jpeg|image\/png)$/i;
    if (f.test(i.type)) {
      // check for file size <= 10 MB
      if (i.size <= (10 * 1024 * 1024)) {
        // r = reader
        var r = new FileReader();
        r.onload = function(e) {
          // append the image
          var image = $('<img alt="preview" />');
          image.attr('src', e.target.result);
          image.on('load', function() {
            // insert preview to DOM
            p.append(image).fadeIn(500);
            u.hide();
            imageSelected = true;
          });
        }

        // pass file to FileReader
        r.readAsDataURL(i);
      }
    }
  }
}

var f = $('#form');
f.on('submit', submitForm);
function submitForm(e) {
  var hasError = false;
  // check for image
  if (!hasError && !imageSelected) {
    $('.parent').animate({
      left: -screenWidth*3
    }, 400);
    currentSlide = 3;
    $('#imageerror').show();
    hasError = true;
  }

  if (!hasError) {
    $('.required').each(function() {
      if (!hasError) {
        var field = $(this);
        var val = field.val();
        if (typeof val != 'string' || val == '') {
          hasError = true;
          currentSlide = field.attr('data-slide') || 1;
          $('.parent').animate({
            left: -screenWidth*currentSlide
          }, 400);
          field.next('.error').show();
        }
      }
    });
  }

  if (hasError) {
    e.preventDefault();
    return false;
  }

  return true;
}

  
} );
