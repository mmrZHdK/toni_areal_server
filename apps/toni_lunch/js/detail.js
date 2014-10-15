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



	var pdfUrl4akt = "http://4akt.ch/uploads/pdf/tagesmenu/menu.pdf";
	var pdfUrlLunch5 = "http://www.lunch-5.ch/menu/menuplan.pdf";
	var pdfUrlWestend = "http://westend-zuerich.ch/uploads/PDF/13.10.-17.10.2014.pdf";
	var jpgUrlBernoulli = "http://www.brasseriebernoulli.ch/mittagskarte/15.10.2014.jpg";


	var mapId = getUrlParameter('mapId');
	var iframesrc ="";


	switch(mapId) {
		
		case '4akt':
			iframesrc = pdfUrl4akt;  	
			break;
		case 'lunch5':
			iframesrc = pdfUrlLunch5;  	
			break;
		case 'westend':
			iframesrc = pdfUrlWestend;  	
			break;
		case 'bernoulli':
			iframesrc = jpgUrlBernoulli;  	
			break;
		
	}

	
	$('.detail iframe').attr('src', iframesrc);
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