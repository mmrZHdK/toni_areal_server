
// View

$(document).ready(function(){
	console.log(isLoggedIn());
	
	getAllProfiles(function(profiles) {
		console.log("profiles ARE HERE");
		console.log(profiles.val());

		$.each(profiles.val(), function(profileId, profile) {
			console.log(profileId);
			$('#profilelist-placeholder').append('<li class="li mehr"><a href="profil.html?id='+profileId+'"><img class="thumbphoto" src="' + profile.fotos.foto1 + '"></img></a></li>');
			$('#profilelist-placeholder').append('<li class="li mehr"><a href="profil.html?id='+profileId+'"><img class="thumbphoto" src="' + profile.fotos.foto2 + '"></img></a></li>');
		});
	});



	// DAS ZB IM EDITSCREEN BRUCHE ODER SO (ODER AU FèR MEIN PROFIL ANZEIGEN)
	getCurrentProfile(function(myProfileNode) {
		//Hier habe ich mein Profil
		var myProfile = myProfileNode.val();

		updateProfile(myProfile);


		$('#myProfilename').append('<div class="name">' + myProfile.name + '</div>');
		$('#myProfilename').append('<div class="name">' + myProfile.surname + '</div>');
		$('#mydescrp').append('<div>' + myProfile.descrp + '</div>');
		$('#myProfilephoto').append('<img class="photo" src="' + myProfile.imageUrl + '"></img>');
		$('#myProjects').append('<img class="li" src="' + myProfile.fotos.foto1 + '"></img>');
		$('#myProjects').append('<img class="li" src="' + myProfile.fotos.foto2 + '"></img>');
	});

	// Click funktion
	$('#btn-create').click(uploadImage);

});


