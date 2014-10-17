$(document).ready(function(){
	




	

	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();

	var outputBernoulli = ((''+day).length<2 ? '0' : '') + day + "." +
	((''+month).length<2 ? '0' : '') + month + '.' +
	d.getFullYear() ;



// Get the date, move to Monday (if not already Monday),
// then alert the date to the user in a different format.
var montagWestend = Date.parse('monday').toString('d' + "." + "M" + ".");
var freitagWestend = Date.parse('friday').toString('d' + "." + "M" + "." + "yyyy");
 



	var pdfUrl4akt = "http://4akt.ch/uploads/pdf/tagesmenu/menu.pdf";
	var pdfUrlLunch5 = "http://www.lunch-5.ch/menu/menuplan.pdf";
	var pdfUrlWestend = "http://westend-zuerich.ch/uploads/PDF/" + montagWestend + "-" + freitagWestend + ".pdf";
	var jpgUrlBernoulli = "http://www.brasseriebernoulli.ch/mittagskarte/" + outputBernoulli + ".jpg";

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