var mapIsDisplayed = false;
var paper;

$(function() {
	$("#openMapButton").on('click', function() {
		if (mapIsDisplayed) {
			paper.remove();
			$("#statusPage").show();
			mapIsDisplayed = false;
			$("#openMapIcon").show();
		} else {
			$("#statusPage").hide();
			drawMap();
			mapIsDisplayed = true;
			$("#openMapIcon").hide();
			$("#closeMapIcon").show();

			// show close map openMapIcon
			
		}
		
	});
});


function drawMap() {
	// 568 is full height
	paper = Raphael(0, 0, 320, 568);

	var img = paper.image("img/map-04.png", 0, 0, 320, 568);

	var myCurrentLocation = undefined;


	var drawPerson = function(x, y, name, color) {
		var person = paper.circle(x, y, 10);
		var name = paper.text(x + 15, y - 15, name);
		person.attr('fill', color);
		return person;
	};

	var savePerson = function(x, y, name, color) {
		var person = {};
		person.x = x;
		person.y = y;
		person.name = name;
		person.color = color;
		addLocation(person);
	};

	var deleteOldLocation = function() {

	};

	$(document).bind('click touchend', function(event) {
		
		var x = event.clientX;
		var y = event.clientY;

		if (myCurrentLocation) {
			myCurrentLocation.remove();

		}
		var color = localStorage.getItem('color')
		var currentUsername = localStorage.getItem('username');
		savePerson(x, y, currentUsername, color)
		myCurrentLocation = drawPerson(x, y, currentUsername, color);
		
	});


	var loadAllPeople = function() {
		var allPeople = loadLocations(function(people) {
			$.each(people.val(), function(i, person) {
				var person = drawPerson(
					person.x,
					person.y,
					person.name,
					person.color
					);

				var currentUsername = localStorage.getItem('username');
				if (person.name === currentUsername) {
					myCurrentLocation = person;
				}
			});

		});

	};

	loadAllPeople();


}


