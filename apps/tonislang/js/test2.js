
//Verbindung zu Firebase
var ref = new Firebase('https://toni-slang.firebaseio.com/');

// Variable für das Firebase Objekt mit allem drin
var postsRef = ref.child("lexicon");


//----------------------------------------------------------------------
// Variablen
//----------------------------------------------------------------------


//AuthorInput Field
var author = $('#authorInput').val();

//WordInput Field
var word = $('#wordInput').val();

//DescriptionInput Field
var description = $('#descriptionInput').val();




//----------------------------------------------------------------------
// Neuer Eintrag generieren
//----------------------------------------------------------------------


  //Auf ID Create wird Klickfunktion ausgeführt
  $('#create').click(function() {
          
          //Meldung das Wort hinzugefügt wurde
          alert("Wort wurde hinzugefügt");

          
          //Variablen übergeben Inhalt an .val
          var author = $('#authorInput').val();
          var word = $('#wordInput').val();
          var description = $('#descriptionInput').val();
          
          //Eintrag wird zu Firebase gepusht (ID wird erzeugt) 
          postsRef.push({author: author, word: word, description: description});

          // Eingabefelder werden geleert
          $('#wordInput').val('');
          $('#descriptionInput').val('');

});





//----------------------------------------------------------------------
// letztes Element Erstellen
//----------------------------------------------------------------------


//Variable für letztes Element
var lastElement = $('#last-element');

//Funktion letztes Element anzeigen
postsRef.endAt().limit(1).on("child_added", function(snapshot) {



    var newPost = snapshot.val();

    var messageElement = $("<p>");
    var wordElement = $("<strong>");
        
    wordElement.text(newPost.word);
    messageElement.text(newPost.description).prepend(wordElement);
    
    lastElement.append(messageElement)

  });











//----------------------------------------------------------------------
// Random Element Erstellen
//----------------------------------------------------------------------

//Erstellt Variable Lexikon
var lexikon = [];

//ID für random element
var randomElement = $('#random-element');

//random funktion auf click
$('#random').click(function() {



  //holt alle Elemente mit Value aus Firebase 
  postsRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

      //und pusht diese in Lexikon Array
      lexikon.push(childSnapshot.val());
      });

      //random funktion (anhand von anzahl aller elemente)
      var rand = Math.floor(Math.random() * snapshot.numChildren());


    //erstellt random element und erstellt es 
    var newPost = lexikon[rand];

    var messageElement = $("<h2>");
    var wordElement = $("<strong>");
        
    wordElement.text(newPost.word);
    messageElement.text(newPost.description).prepend(wordElement);
    
    
    randomElement.append(messageElement)
  

    });

});


//----------------------------------------------------------------------
// Liste Erstellen
//----------------------------------------------------------------------



var nameList = $('#name-list');

// alle + neue Elemente in der Firebase
postsRef.on('child_added', function (snapshot) {

    var newPost = snapshot.val();

    var messageElement;
    
    messageElement = createLI(newPost);

    //Element hinzufügen
    nameList.append(messageElement);
});




    // Funktion Liste erstellen
    function createLI (newPost) {
        

        // message elemment wird ein listen element
        var messageElement = $("<li>");
        
        //word element wird mit href versehen
        var wordElement = $("<a>").attr("href", "(laden das )");;
    
        // word element erhält inhalt
        wordElement.text(newPost.word);
        messageElement.html(wordElement);

        
        // funktion gibt message Element zurück
        return messageElement;

}
  






//----------------------------------------------------------------------
// alter Scheiss
//----------------------------------------------------------------------













