$(document).ready(function(){
	$('#idMenu').click(function() {	
    $('.info').toggleClass("info_out_top");
    $('.menubar').toggleClass("menubar_out_bottom");
  	
    $('.info').toggleClass("info-in");
    $('.menubar').toggleClass("menubar-in");

  	});

  $('.info').click(function() {	
    $('.info').toggleClass("info_out_top");
    $('.menubar').toggleClass("menubar_out_bottom");
  	
    $('.info').toggleClass("info-in");
    $('.menubar').toggleClass("menubar-in");
  	});



	var mapUrlMensa = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2701.112392987853!2d8.511245700000002!3d47.3902399!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900a47db938dbd%3A0x1be3ad65a16f8daa!2sPfingstweidstrasse+96%2C+8005+Z%C3%BCrich!5e0!3m2!1sde!2sch!4v1413289298639";
	var mapUrlBistro = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2701.112392987853!2d8.511245700000002!3d47.3902399!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900a47db938dbd%3A0x1be3ad65a16f8daa!2sPfingstweidstrasse+96%2C+8005+Z%C3%BCrich!5e0!3m2!1sde!2sch!4v1413289298639";
	var mapUrlEquinox = "https://www.google.com/maps/embed?pb=!1m29!1m12!1m3!1d2701.1357231261763!2d8.512598631072276!3d47.38978467997974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!1i0!3e2!4m5!1s0x47900a46391f7b63%3A0xe4fc221220960fc1!2sToni+Areal%2C+8005+Z%C3%BCrich!3m2!1d47.391799999999996!2d8.5128!4m5!1s0x47900a38a4fd2bc1%3A0x89c5be2f94ef2f64!2sEQUINOX+Restaurant%2C+Turbinenstrasse+20%2C+8005+Z%C3%BCrich!3m2!1d47.388003999999995!2d8.514427!5e0!3m2!1sde!2sch!4v1413298683702";
	var mapUrl4akt = "https://www.google.com/maps/embed?pb=!1m29!1m12!1m3!1d5402.244315340699!2d8.512843742244188!3d47.39004937093165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!1i0!3e2!4m5!1s0x47900a46391f7b63%3A0xe4fc221220960fc1!2sToni+Areal%2C+8005+Z%C3%BCrich!3m2!1d47.391799999999996!2d8.5128!4m5!1s0x47900a40398482df%3A0x1acb1ef3b6a66370!2s4.+Akt%2C+Heinrichstrasse+262%2C+8005+Z%C3%BCrich!3m2!1d47.389472!2d8.521735999999999!5e0!3m2!1sde!2sch!4v1413313999318";
	var mapUrlBernoulli = "https://www.google.com/maps/embed?pb=!1m29!1m12!1m3!1d2700.981263066015!2d8.507605948184366!3d47.39279845840948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!1i0!3e2!4m5!1s0x47900a46391f7b63%3A0xe4fc221220960fc1!2sToni+Areal%2C+8005+Z%C3%BCrich!3m2!1d47.391799999999996!2d8.5128!4m5!1s0x47900a4932341333%3A0x3b15391d917162b9!2sBrasserie+Bernoulli%2C+Hardturmstrasse+261%2C+8005+Z%C3%BCrich!3m2!1d47.393521!2d8.508205!5e0!3m2!1sde!2sch!4v1413314075547";
	var mapUrlLunch5 = "https://www.google.com/maps/embed?pb=!1m29!1m12!1m3!1d2701.037448163736!2d8.511564798184299!3d47.391702208484865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!1i0!3e2!4m5!1s0x47900a46391f7b63%3A0xe4fc221220960fc1!2sToni+Areal%2C+8005+Z%C3%BCrich!3m2!1d47.391799999999996!2d8.5128!4m5!1s0x47900a46f354848b%3A0xc5bfac68a2a3d187!2sRestaurant+Lunch+5%2C+F%C3%B6rrlibuckstrasse+62%2C+8005+Z%C3%BCrich!3m2!1d47.391943999999995!2d8.514942999999999!5e0!3m2!1sde!2sch!4v1413314269214";
	var mapUrlWestend = "https://www.google.com/maps/embed?pb=!1m29!1m12!1m3!1d2701.019438288889!2d8.509259548184351!3d47.39205360846075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m14!1i0!3e2!4m5!1s0x47900a46391f7b63%3A0xe4fc221220960fc1!2sToni+Areal%2C+8005+Z%C3%BCrich!3m2!1d47.391799999999996!2d8.5128!4m5!1s0x47900a48957d5fdf%3A0x5c0b8c1fff3d2bbb!2sWestend%2C+F%C3%B6rrlibuckstrasse+180%2C+8005+Z%C3%BCrich!3m2!1d47.3923!2d8.510271!5e0!3m2!1sde!2sch!4v1413314183288";



	var mapId = getUrlParameter('mapId');
	var iframesrc ="";


	switch(mapId) {
		case 'mensa':
			iframesrc = mapUrlMensa;  	
			break;
		case 'equinox':
			iframesrc = mapUrlEquinox;  	
			break;
		case 'bistro':
			iframesrc = mapUrlBistro;  	
			break;
		case '4akt':
			iframesrc = mapUrl4akt;  	
			break;
		case 'bernoulli':
			iframesrc = mapUrlBernoulli;  	
			break;
		case 'lunch5':
			iframesrc = mapUrlLunch5;  	
			break;
		case 'westend':
			iframesrc = mapUrlWestend;  	
			break;
	}

	
	$('.googleMaps iframe').attr('src', iframesrc);
});


function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}