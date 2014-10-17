$(document).ready(function() {


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

var file = $('#imageInput').val();

var file = $('#imageInput')[ 0 ].files[ 0 ];


function uploadImage() {
  // console.log("yay");

    var file = $('#imageInput')[ 0 ].files[ 0 ];

    // console.log("fill:"+ file);

        /* Is the file an image? */
        if (!file || !file.type.match(/image.*/)) return;

        /* It is! */
        document.body.className = "uploading";
        
        

        /* Lets build a FormData object*/
        var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
        fd.append("image", file); // Append the file
        var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
        xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
        xhr.onload = function() {
            // Big win!
            // document.querySelector("#link").href = JSON.parse(xhr.responseText).data.link;
            document.body.className = "uploaded";

            pushToFirebase(JSON.parse(xhr.responseText).data.link);
        }
        
        xhr.setRequestHeader('Authorization', 'Client-ID 28aaa2e823b03b1'); // Get your own Client-ID at http://api.imgur.com/
        
        // Ok, I don't handle the errors. An exercise for the reader.

        /* And now, we send the formdata */
        xhr.send(fd);

      }



function pushToFirebase(link) {


    // upload( LINKELEMENT );

    // mache Link zu Firebase tauglichem Element

    // var link existiert bereits Parameter
    var author = $('#authorInput').val();
        var word = $('#wordInput').val();
        var description = $('#descriptionInput').val();    

        
        postsRef.push().setWithPriority({author: author, word: word, description: description, link: link}, word);

        $('#wordInput').val('');
        $('#descriptionInput').val('');
        //$('#imageInput').val('');
        $('#settingsModal').removeClass("active");


        slangDetailFill(word,description,author);


        $('body').css({
      'backgroundImage': 'url(' + link + ')'
    });
}




// Click funktion
$('#create').on('click', function() {
  
  

  var error = false;

  if( '' == $('#authorInput').val()) {
    alert("Ich brauch nen Namen! Hast du doch? ODER!!!");
    $('#authorInput').addClass('wtf')
    
    error = true
  }

  else if( '' == $('#wordInput').val()) {
    alert("Ohne nen Begriff geht bei mir gar nichts! ALLES KLAR?");
    error = true
  }

  else if( '' == $('#descriptionInput').val()) {
    alert("Wir beide wissen du hast was dazu zu sagen!");
    error = true
  }

   else if( '' == $('#imageInput').val()) {
    alert("Wir brauchen auch nicht unbedingt ein NacktSelfie, aber ein Bild wär schon schön! OK?");
    error = true
  }

  

  if (!error) {
    uploadImage();
      
  }
});




















//----------------------------------------------------------------------
// Neuer Eintrag generieren
//----------------------------------------------------------------------


  //Auf ID Create wird Klickfunktion ausgeführt
//   $('#create').click(function() {
          
//           //Meldung das Wort hinzugefügt wurde
//           // alert("Wort wurde hinzugefügt");

          
//           //Variablen übergeben Inhalt an .val
//           var author = $('#authorInput').val();
//           var word = $('#wordInput').val();
//           var description = $('#descriptionInput').val();
//           upload( bild );
          
          
//           //Eintrag wird zu Firebase gepusht (ID wird erzeugt) 
//           // postsRef.push().setWithPriority({author: author, word: word, description: description}, word);

//           // Eingabefelder werden geleert
//           $('#wordInput').val('');
//           $('#descriptionInput').val('');

//           $('#settingsModal').removeClass("active");








// });





//----------------------------------------------------------------------
// letztes Element Erstellen
//----------------------------------------------------------------------


// //Variable für letztes Element
// var lastElement = $('#random-element');

// //Funktion letztes Element anzeigen
// postsRef.endAt().limit(1).on("child_added", function(snapshot) {



//     var newPost = snapshot.val();

//     var messageElement = $("<p>");
//     var wordElement = $("<strong>");
        
//     // wordElement.text(newPost.word);
//     // messageElement.text(newPost.description).prepend(wordElement);
    
//     // lastElement.append(messageElement)

//     slangDetailFill(newPost.word, newPost.description,newPost.author)

//   });









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
    //console.log(newPost.word);


    //ruft SlangDetail funktion auf und setzt ein
    slangDetailFill(newPost.word, newPost.description,newPost.author)

    $('body').css({
      'backgroundImage': 'url(' + newPost.link + ')'
    });
    

    
  

    });

});


//----------------------------------------------------------------------
// Liste Erstellen
//----------------------------------------------------------------------





var nameList = $('.name-list');




// console.log(nameList);

// alle + neue Elemente in der Firebase
postsRef.on('child_added', function (snapshot) {

    var ListPost = snapshot.val();

    // var messageElement;
    
    // messageElement = createLI(ListPost);


    //message Element muss Funktion slangDetailFill auf Click auf Li ausführen

    // console.log(ListPost);

    //Element hinzufügen
    //nameList.append('<li><h2 class="wort">'+ListPost.word+'</h2></li><ul style="display: none;"><li><div class="bildliste"><img  src="'+ListPost.link+'"/></div></li><li><p class="beschreibung">'+ListPost.description+'</p></li><li><p class="autor">'+ListPost.author+'</p></li></ul>');

    // ('div')
    

    $('<li>' , {
      class: 'accordionLi',
      html: '<h2 class="wort">'+ListPost.word+'</h2>'
    }).appendTo(nameList).on('click', function(){
      console.log('Test');

      if(false == $(this).next().is(':visible')) {
        $('.accordionUl').slideUp(300);
      }
      $(this).next().slideToggle(300);
    });

    // $('#accordion ul:eq(0)').show();

    $('<ul>' , {
      class: 'accordionUl',
      html: '<li><div class="bildliste"><img  src="'+ListPost.link+'"/></div></li><li><p class="beschreibung">'+ListPost.description+'</p></li><li><p class="autor">'+ListPost.author+'</p></li>',
      display: 'none'
    }).appendTo(nameList);

});


});







    // Funktion Liste erstellen
//     function createLI (ListPost) {
        

//         // message elemment wird ein listen element
//         var messageElement = $("<li>");
        
//         //word element wird mit href versehen
//         // var wordElement = $("<div>");
    
//         // word element erhält inhalt
//         // wordElement.html('<h2 class="wort">'+ListPost.word+'</h2><div class="bildliste"><img  src="'+ListPost.link+'"/></div><p class="beschreibung">'+ListPost.description+'</p><p class="autor">'+ListPost.author+'</p>');
//         // messageElement.html(wordElement);

//         messageElement.html('<h2 class="wort">'+ListPost.word+'</h2><div class="bildliste"><img  src="'+ListPost.link+'"/></div><p class="beschreibung">'+ListPost.description+'</p><p class="autor">'+ListPost.author+'</p>');
//         // messageElement.html(wordElement);

//         // console.log(ListPost.link);



        
//         // funktion gibt message Element zurück
//         return messageElement;

// }


//     // Funktion Namens erstellen
//     function createLI (ListPost) {
        

//         // message elemment wird ein listen element
//         // var messageElement = $("<li>");
//         var messageElement = $("<li>");
        
//         //word element wird mit href versehen
//         // var wordElement = $("<div>");
    
//         // word element erhält inhalt
//         // wordElement.html('<h2 class="wort">'+ListPost.word+'</h2><div class="bildliste"><img  src="'+ListPost.link+'"/></div><p class="beschreibung">'+ListPost.description+'</p><p class="autor">'+ListPost.author+'</p>');
//         // messageElement.html(wordElement);

//         messageElement.html('<li><h2 class="wort">'+ListPost.word+'</h2></li><ul style="display: none;"><li><div class="bildliste"><img  src="'+ListPost.link+'"/></div></li><li><p class="beschreibung">'+ListPost.description+'</p></li><li><p class="autor">'+ListPost.author+'</p></li></ul>');

//         console.log("jkbhadsvjkhasdv");

//         // messageElement.html(wordElement);

//         // console.log(ListPost.link);



        
//         // funktion gibt message Element zurück
//         return messageElement;

// }

  






//----------------------------------------------------------------------
// Main Event
//----------------------------------------------------------------------






;

function slangDetailFill (word, description,author) {

  var slangDetail = $('.slangdetail');

      slangDetail.find("h2").html(word);
      slangDetail.find('.beschreibungsdetail').html(description);
      slangDetail.find('.autordetail').html(author);




//Table Tap  Function

}

// var mylatesttap = 0

// document.addEventListener( 'touchstart', function (e) {
// var now = new Date().getTime();
// var timesince = now - mylatesttap;
// if((timesince < 350) && (timesince > 0)){
// //DO STUFF



// }
// mylatesttap = new Date().getTime()
// }, false );

//----------------------------------------------------------------------
// Search 
//----------------------------------------------------------------------

// var options = {
//   valueNames: [ 'wort', 'beschreibung', 'autor' ]
// };

// var userList = new List('users', options);


function doOnOrientationChange()
      {
        switch(window.orientation) 
        {  
          case -90:                 
                 document.getElementById("landscape").style.display="block";
                 break;
          case 90:              
                document.getElementById("landscape").style.display="block";                 
                break;
         default:                   
                document.getElementById("landscape").style.display="none";
                break;                            
        }
      }

      //Listen to orientation change
      window.addEventListener('orientationchange', doOnOrientationChange); 

$("input[type='text']").change(function(){

    $(this).css({'background-color': '#ffff9d','color': '#00C035'});
});


$("input[type='file']").change(function(){

    $("input[type='button']").css({'background-color': '#ffff9d','color': '#00C035'} );
    // $("input[type='button']").css('color', '#ffff00');
});
