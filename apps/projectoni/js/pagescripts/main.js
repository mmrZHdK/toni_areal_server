
// View

$(document).ready(function(){
	console.log(isLoggedIn());
	

	// DAS ZB IM EDITSCREEN BRUCHE ODER SO (ODER AU FèR MEIN PROFIL ANZEIGEN)
	currentProfile(function(myProfileNode) {
		//Hier habe ich mein Profil
		var myProfile = myProfileNode.val();

		updateProfile(myProfile);


		$('#myProfileinfos').append('<div>' + myProfile.name + '</div>');
		$('#myProfileinfos').append('<div>' + myProfile.email + '</div>');
		$('#myProfilephoto').append('<img class="photo" src="' + myProfile.imageUrl + '"></img>');
		$('#myProjects').append('<img class="li" src="' + myProfile.fotos.foto1 + '"></img>');
		$('#myProjects').append('<img class="li" src="' + myProfile.fotos.foto2 + '"></img>');
	});

	


	loadAllProfiles(function(profiles) {
		console.log("profiles ARE HERE");
		console.log(profiles.val());

		$.each(profiles.val(), function(i, profile) {
			$('#profilelist-placeholder').append('<li class="li"><img class="thumbphoto" src="' + profile.fotos.foto1 + '"></img></li>');
			$('#profilelist-placeholder').append('<li class="li"><img class="thumbphoto" src="' + profile.fotos.foto2 + '"></img></li>');
		});
	});





	//ALSO ALLES DA UNE Ghört nöd da ane also las verschwinde im profil add screen oder so
	/*var profile = {

		name: 'Ursli',
		email: 'info@asdasd.com',
		imageUrl: 'http://asdasd.com',

		fotos: {
			foto1: 'asdasd',
			foto2: 'asdas'
		}

	}

	var profile = {};


	profile.name = $('#name-feld').val();

	updateProfile(getCurrent,profile);*/

});
