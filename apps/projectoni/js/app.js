var f = new Firebase("https://projectoni.firebaseio.com/");


function isLoggedIn() {
	return f.getAuth() != null;
}

// User Functions

function getCurrentProfile(callback) {
	return getUserProfile(getCurrentProfileId(),callback);
}

function getUserProfile(id,callback) {
	return f.child(id).once('value', callback);
}

function getAllProfiles(callback) {
	return f.once('value', callback);
}

function addProfile(id, imgLink) {

	var profile = {
		name: $('#name').val(),
		surname: $('#surname').val(),		
		email: $('#newemail').val(),
		website: $('#website').val(),
		descrp: $('#descrp').val(),
		imageUrl: 'http://i.imgur.com/RDt7RuO.png',

		fotos: {
			foto1: imgLink	,
			foto2: ''
		}

	}

	f.child(id).set(profile);
}

function getCurrentProfileId() {
	console.log(f.getAuth().uid);
	var id = f.getAuth().uid.substring(f.getAuth().uid.indexOf(':')+1,f.getAuth().uid.length);
	console.log(id);
	return id;
}

function updateProfile(data) {
	f.child(getCurrentProfileId()).set(data);
}



function getUrlParameter(sParam) {
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