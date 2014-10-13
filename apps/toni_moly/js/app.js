
//Verbindung zu Firebase
var firebaseRef = new Firebase("https://tonimoly.firebaseio.com");

// Variable für das Firebase Objekt mit allem drin
var f = firebaseRef.child("statusEntries");
var locations = firebaseRef.child("locations");


function loadAllStatusEntries(callback) {
	return f.once('value', callback);
}

function addStatusEntry(data) {
	f.push(data);
}


function loadLocations(callback) {
	return locations.once('value', callback);
}

function removeLocation(callback, location) {
	
}

function addLocation(person) {
	locations.push(person);
}

function saveToLocalStorage(key,value) {
	localStorage.setItem(key,value);
}