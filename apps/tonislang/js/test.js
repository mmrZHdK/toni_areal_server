var ref = new Firebase('https://toni-slang.firebaseio.com/');

var author = $('#authorInput').val();
var word = $('#wordInput').val();
var description = $('#descriptionInput').val();

var postList = $('#example-messages');
var listList = $('#example-list');
var lastElement = $('#example-last');
var randomElement = $('#example-random');

 
var postsRef = ref.child("lexicon");

//bei Button Click wird neues Wort erstellt
  $('#btn2').click(function() {
        console.log("yay button clicked");
          var author = $('#authorInput').val();
          var word = $('#wordInput').val();
          var description = $('#descriptionInput').val();
          
          
          postsRef.push({author: author, word: word, description: description});

          $('#wordInput').val('');
          $('#descriptionInput').val('');

});









// Retrieve new posts as they are added to Firebase
postsRef.on('child_added', function (snapshot) {
  var newPost = snapshot.val();


  var messageElement = $("<li>");
    var wordElement = $("<p>");
    wordElement.text(newPost.word);
    messageElement.text(newPost.word);

    //ADD MESSAGE
    listList.append(messageElement)


    //SCROLL TO BOTTOM OF MESSAGE LIST
    // listList[0].scrollTop = listList[0].scrollHeight;
});


// Retrieve new posts as they are added to Firebase
postsRef.on('child_added', function (snapshot) {
  var newPost = snapshot.val();


  var messageElement;
    
  messageElement = macheliauspost(newPost);

    //ADD MESSAGE
    postList.append(messageElement)


    //SCROLL TO BOTTOM OF MESSAGE LIST
    // postList[0].scrollTop = postList[0].scrollHeight;
});


function macheliauspost (newPost) {


  var messageElement = $("<li>");
  var wordElement = $("<strong>");
    wordElement.text(newPost.word);
    messageElement.text(newPost.description).prepend(wordElement);

    return messageElement;

}



var count = 0;
postsRef.on('child_added', function(snap) {
  count++;
  console.log('added', snap.name());
});
// length will always equal count, since snap.val() will include every child_added event
// triggered before this point
postsRef.once('value', function(snap) {
  console.log('initial data loaded!', Object.keys(snap.val()).length === count);
});




       
      function getFirstFromList(postsRef, cb) {
        postsRef.endAt().limit(1).once("child_added", function(snapshot) {
          cb(snapshot.val());
        });
      }
       
      // Running this should popup an alert with "banana".
      function go() {
  
        getFirstFromList(postsRef, function(val) {

        

        var newPost = val;


        var messageElement = $("<p>");
        var wordElement = $("<strong>");
        wordElement.text(newPost.word);
        messageElement.text(newPost.description).prepend(wordElement);

          //ADD MESSAGE
          lastElement.append(messageElement)




        });
      }


   


