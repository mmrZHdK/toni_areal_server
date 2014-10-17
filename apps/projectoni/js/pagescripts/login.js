var callbackFunction = function(imgLink) {
	var newemail = $('#newemail').val();
	var newpassword = $('#newpassword').val();
	createUser(newemail, newpassword, imgLink);
}

$(document).ready(function(){

	$( "#btn-create" ).on('click', function(e){
		uploadImage(callbackFunction);
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

function createUser(email, password, imgLink) {
	f.createUser( {
		email: email,
		password: password
	}, function(error) {
		if (error) {
			console.error("Error creating user:", error);
		}

		login(email, password, imgLink, function() {
			window.location.replace('myprofil.html');
		});

	}); 
	
}

function logout() {
	f.unauth();
}

function login(email, password, imgLink, callback) {

	f.authWithPassword({
		email: email,
		password: password
	}, function(err, data){
		if (err === null) {

			console.log("LOGIN JAAAsss");

			// HIER NOCH NEUES LEERES PROFIL MIT DER GLEICHEN ID ERSTELLEN
			getCurrentProfile(function(profile) {
				console.log(profile)
				if(profile.val() === null || profile.val() === undefined) {
					console.log("ES NEUS MACHE" + getCurrentProfileId());
					addProfile(getCurrentProfileId(), imgLink);
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


function uploadImage(callbackFunction) {
     console.log("yay");

    var file = $('#imageInput')[ 0 ].files[ 0 ];

    // console.log("fill:"+ file);

    /* Is the file an image? */
    if (!file || !file.type.match(/image.*/)) {
    	return;
    }
    
    /* Lets build a FormData object*/
    var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    fd.append("image", file); // Append the file
    var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
    xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
    xhr.onload = function() {
        var imgLink = JSON.parse(xhr.responseText).data.link;
        callbackFunction(imgLink);
    }
    
    xhr.setRequestHeader('Authorization', 'Client-ID 4213a113e7c4f54'); // Get your own Client-ID at http://api.imgur.com/
    
    // Ok, I don't handle the errors. An exercise for the reader.

    /* And now, we send the formdata */
    xhr.send(fd);

}