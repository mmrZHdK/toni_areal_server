//Erstellt Variable Lexikon
var liste = [];

//ID für random element
var listeElement = $('#name-list');

//random funktion auf click




  //holt alle Elemente mit Value aus Firebase 
  postsRef.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

      //und pusht diese in Lexikon Array
      liste.push(childSnapshot.val());
      });

      


    //erstellt random element und erstellt es 
    var neuePost = lexikon[];
    //console.log(newPost.word);

    var messageElement;
    
    messageElement = createLI(ListPost);


    nameList.append(messageElement);

    });

