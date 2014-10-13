$(document).ready(function(){

	$( "#btn-create" ).on('click', function(e){
		var newemail = $('#newemail').val();
		var newpassword = $('#newpassword').val();
		createUser(newemail, newpassword);
		console.log("account steht");
		e.preventDefault();
	});

	$( "#btn-update" ).on('click', function(e){
		var username = $('#usernameinfo').val();
		var website = $('#websiteinfo').val();
		var email = $('#emailinfo').val();
		addProfileinfo(newemail, newpassword);
		e.preventDefault();
	});


	$( "#btn-login" ).click(function(e){
		e.preventDefault();
		var self = this;
		console.log(self);
		var emaillogin = $('#emaillogin').val();
		var passwordlogin = $('#passwordlogin').val();
		var user = $('#inp_username').val();
		login(emaillogin, passwordlogin, function() {
			window.location.replace('myprofil.html');
		});
		
	});

	$( "#logout" ).on('click', function(e){
		logout();
		console.log("uund weg!");
	});

	$( "#checkLogin" ).on('click', function(e){
		console.log(isLoggedIn());
	});

});



function createUser(email, password) {
	f.createUser( {
		email: email,
		password: password
	}, function(error) {
		if (error) {
			console.error("Error creating user:", error);
		}

	}); 
	
}

function logout() {
	f.unauth();
}

function login(email, password, callback) {

	f.authWithPassword({
		email: email,
		password: password
	}, function(err, data){
		if (err === null) {

			console.log("LOGIN JAAA");

			// HIER NOCH NEUES LEERES PROFIL MIT DER GLEICHEN ID ERSTELLEN
			currentProfile(function(profile) {
				console.log(profile)
				if(profile.val() === null || profile.val() === undefined) {
					console.log("ES NEUS MACHE" + getCurrentProfileId());
					addProfile(getCurrentProfileId());
				}
				callback();
			});

			

		} else {
			console.log("Passt doch nicht!");
			console.log(err);
		}
		
	}, {
		remember: "default"
	});
}