var mapIsDisplayed = false;
var paper;
var hand = false;

$(function() {
	$("#openMapButton").on('click', function() {
		if (mapIsDisplayed) {
			$('body').css({background: 'white'});
			paper.remove();
			$("#hand").hide();
			$("#statusPage").show();
			mapIsDisplayed = false;
		
			$("#chatIcon1").show();
			$("#openMapIcon1").hide();
			$("#openMapIcon2").show();
			$("#chatIcon2").hide();

			

		} else {
			$("#hand").show();
			$("#hand").delay(2000).hide(0);
			$('body').css({background: '#575756'});
			$("#statusPage").hide();
			drawMap();
			mapIsDisplayed = true;
			//$("#openMapIcon").hide();
			

			$("#openMapIcon1").show();
			$("#openMapIcon2").hide();
			$("#chatIcon2").show();
			$("#chatIcon1").hide();
			
		}
		
	});
});

$(function() {
	$("#closeMapButton").on('click', function() {
		if (mapIsDisplayed) {
			$('body').css({background: 'white'});
			paper.remove();
			$("#hand").hide();
			$("#statusPage").show();
			mapIsDisplayed = false;
		
			$("#chatIcon1").show();
			$("#openMapIcon1").hide();
			$("#openMapIcon2").show();
			$("#chatIcon2").hide();

			

		} else {
			$("#hand").show();
			$("#hand").delay(2000).hide(0);
			$('body').css({background: '#575756'});
			$("#statusPage").hide();
			drawMap();
			mapIsDisplayed = true;
			//$("#openMapIcon").hide();
			

			$("#openMapIcon1").show();
			$("#openMapIcon2").hide();
			$("#chatIcon2").show();
			$("#chatIcon1").hide();
			
		}
		
	});
});





function drawMap() {
	// 568 is full height
	paper = Raphael(0, 0, 320, 480);

	var img = paper.image("img/map-04.png", 0, 0, 320, 480);

	var myCurrentLocation = undefined;


	var drawPerson = function(x, y, name, color) {
		var person = paper.circle(x, y, 10);
		var name = paper.text(x + 15, y - 15, name);
		person.attr('fill', color);
		return [person,name];
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

	$("svg").bind('click touchend', function(event) {
		
		var x = event.clientX;
		var y = event.clientY;

		if (myCurrentLocation) {
			myCurrentLocation[0].remove();
			myCurrentLocation[1].remove();

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


