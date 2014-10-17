
$(document).ready(function(){

	var profile = null;
	var id = getUrlParameter('id');

	console.log(id);

	if(id != null) {
		getUserProfile(id,function(profileNode) {
			var profile = profileNode.val();
			$('#name').html(profile.name);
			$('#surname').html(profile.surname);
			$('#website').html(profile.website);
			$('#descrp').html(profile.descrp);
			$('#profilephoto').append('<img class="photo" src="' + profile.imageUrl + '"></img>');
			$('#projects').append('<img class="li" src="' + profile.fotos.foto1 + '"></img>');
			$('#projects').append('<img class="li" src="' + profile.fotos.foto2 + '"></img>');
			$('#pwebsite').append('<a href="' + profile.website + '"><img class="naviimg" src="/img/icons-01.png"></img></a>');
			
		});
	}

});