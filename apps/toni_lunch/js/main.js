
window.addEventListener("load",function() {
   setTimeout(function(){
    window.scrollTo(0, 0);
    }, 0);
 });


$(document).ready(function(){

  $('#idMenu').click(function() {	
    $('.info').toggleClass("info_out_top");
    $('.swiper-container').toggleClass("swiper-container_out_bottom");
    $('.menubar').toggleClass("menubar_out_bottom");
  	
    $('.info').toggleClass("info-in");
    $('.swiper-container').toggleClass("swiper-container-in");
    $('.menubar').toggleClass("menubar-in");

  	});

  $('.info').click(function() {	
    $('.info').toggleClass("info_out_top");
    $('.swiper-container').toggleClass("swiper-container_out_bottom");
    $('.menubar').toggleClass("menubar_out_bottom");
  	
    $('.info').toggleClass("info-in");
    $('.swiper-container').toggleClass("swiper-container-in");
    $('.menubar').toggleClass("menubar-in");
  	});

  if (("standalone" in window.navigator) && window.navigator.standalone) {
      // For iOS Apps
      $('a').on('click', function(e){
        e.preventDefault();
        var new_location = $(this).attr('href');
        if (new_location != undefined && new_location.substr(0, 1) != '#' && $(this).attr('data-method') == undefined){
          window.location = new_location;
        }
      });
    }


});




