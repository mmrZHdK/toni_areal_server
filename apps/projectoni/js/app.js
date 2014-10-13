var f = new Firebase("https://projectoni.firebaseio.com/");


function isLoggedIn() {
	return f.getAuth() != null;
}

// User Functions

function currentProfile(callback) {
	return userProfile(getCurrentProfileId(),callback);
}

function userProfile(id,callback) {
	return f.child(id).once('value', callback);
}

function loadAllProfiles(callback) {
	return f.once('value', callback);
}

function addProfile(id) {

	var profile = {
		name: 'name here',
		email: 'email <here></here>',
		website: '',
		imageUrl: 'http://i.imgur.com/RDt7RuO.png',

		fotos: {
			foto1: 'http://i.imgur.com/o3qfnjm.png',
			foto2: 'http://i.imgur.com/IRlsyAZ.png'
		}

	}

	f.child(id).set(profile);
}

function getCurrentProfileId() {
	return f.getAuth().uid.substring(f.getAuth().uid.length-2,f.getAuth().uid.length);
}

function updateProfile(data) {
	f.child(getCurrentProfileId()).set(data);
}
