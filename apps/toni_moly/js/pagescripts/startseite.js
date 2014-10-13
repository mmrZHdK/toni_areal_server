$(document).ready(function(){

	// if kein username gespeichert, dann redirect zu edit screen
	// wie leite ich zu einer anderen seite weiter? findes raus findes raus ;)
	if (localStorage.getItem('username') === null){
		
		window.location="editprofile.html";
		
	}
	
	loadListItems();

	$(".deleteUser").on("click", function(e){

    localStorage.removeItem('username');
    localStorage.removeItem('color');
    
  	});

	
	$("#send-status-button").on("click", function(e) {

		var date = moment().format('h:mm a');
		console.log(date);
		//console.log(localStorage.getItem('color'));


		console.log("schicke!");

		var status = $("#status").val();

	    // check if username valid and color select
	    if (status != null && status.length > 0){

	    	console.log('züg sich guet');

	      	//Save to Firebase
	      	var statusEntry = {};
	      	statusEntry.username = localStorage.getItem('username');
	      	statusEntry.color = localStorage.getItem('color');
	      	statusEntry.status = status;
	      	statusEntry.date = date.toString();

	      	addStatusEntry(statusEntry);
	      	
	      	

	      	// Eingabefelder werden geleert
	      	$('#status').val('');

	      	loadListItems();
	    }

	});

});




function loadListItems() {
	var alleEntries = loadAllStatusEntries(function(statusEntries) {
		console.log('FERTIG GELADEN');
		console.log(statusEntries.val());

		var placeHolder = $('#list-placeholder');

		placeHolder.html('');

		$.each(statusEntries.val(), function(id, statusEntry) {
			var statusEntryHtml = '';
			statusEntryHtml += '<li>';
			statusEntryHtml += '<div class="list-element-container" style="background-color: '+ statusEntry.color +'">';
            statusEntryHtml += '<div class="list-element-username" style="background-color: '+ statusEntry.color +'">' + statusEntry.username +'</div>';
            statusEntryHtml += '<div class="list-element-status" style="background-color: '+ statusEntry.color +'">' + statusEntry.status +'</div>';	
			statusEntryHtml += '<div class="list-element-time" style="background-color: '+ statusEntry.color +'">' + statusEntry.date +'</div>';
			statusEntryHtml += "</div>";
			statusEntryHtml += "</li>";

			placeHolder.prepend(statusEntryHtml);
		});	
	});
}