$(document).ready(function(){

  var color = null;
  var username = null;


  $(".colorList li div").on("click", function(e){
    $(".colorList li div").removeClass("selected");
    $(this).addClass("selected");
    color = $(this).css("background-color");
    console.log(color);
  });

  $(".deleteUser").on("click", function(e){

    localStorage.removeItem("username");
  });

  $(".sendButton").on("click", function(e){

    username = $("#username").val();

    // check if username valid and color select
    if (username != null && color != null){

      //save entry to blabla
      console.log("send username: " + username + ", color: " + color);
  
      saveToLocalStorage('username', username);
      saveToLocalStorage('color', color);

      // Eingabefelder werden geleert
      $('#username').val('');
    }

  });


});