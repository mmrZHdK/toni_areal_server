var rootRef;
// root zur Firebase Datenbank
rootRef = new Firebase('https://incandescent-inferno-8047.firebaseio.com/');
 var fontColor;
 var bgColor;
 

//START DER ZEITKISTE
/////////
///////
//////
function todayDate () {
//Heutiges Datum
var fullDate = Date.today().add(0).days();
console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
console.log(currentDate);
return currentDate;
}
function tomorrowDate () {
//Heutiges Datum
var fullDate = Date.today().add(1).days();
console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
console.log(currentDate);
return currentDate;
}
function tomorrowPlusOneDate () {
//Heutiges Datum
var fullDate = Date.today().add(2).days();
console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
console.log(currentDate);
return currentDate;
}


function currentTime() {
    var now = new Date();
    var nowH = now.getHours()+"";if(nowH.length==1) nowH="0" +nowH;
    var nowM = now.getMinutes()+"";;if(nowM.length==1) nowM="0" +nowM;
    var time = nowH + nowM;
    console.log("WAS ISCH DIE AKTUELLI ZIT?");
    console.log(time);
    return time;

}

function todayStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = todayDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
    console.log("HEUTIGES STARTDATUM MIT ZEIT")
    console.log(timeAndDate);
    return timeAndDate;
}


function todayEndDateAndTime (){
    var currentDate = todayDate();
    var timeAndDate = currentDate +2+3+5+9;
    console.log("HEUTIGES ENDDATUM")
    console.log(timeAndDate);
    return timeAndDate;
}
function tomorrowStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = tomorrowDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
    console.log("HEUTIGES STARTDATUM MIT ZEIT")
    console.log(timeAndDate);
    return timeAndDate;
}


function tomorrowEndDateAndTime (){
    var currentDate = tomorrowDate();
    var timeAndDate = currentDate +2+3+5+9;
    console.log("HEUTIGES ENDDATUM")
    console.log(timeAndDate);
    return timeAndDate;
}

function tomorrowPlusOneStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = tomorrowPlusOneDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
    console.log("HEUTIGES STARTDATUM MIT ZEIT")
    console.log(timeAndDate);
    return timeAndDate;
}


function tomorrowPlusOneEndDateAndTime (){
    var currentDate = tomorrowPlusOneDate();
    var timeAndDate = currentDate +2+3+5+9;
    console.log("HEUTIGES ENDDATUM")
    console.log(timeAndDate);
    return timeAndDate;
}








function creatDateAndTime(sDatesTime){
        sDatesTime = sDatesTime.replace('-','');
        sDatesTime = sDatesTime.replace('-','');
        sDatesTime = sDatesTime.replace(':','');
        return sDatesTime;
}














//ENDE DER ZEITKISTE
/////////
///////
//////
//Funktion um die Elemente aus der Datenbank zu holen und sie in die
//Variable events zu schreiben und an renderEventList als Parameter mitzugeben
//Brauch ich wahrscheinlich nicht mehr --> lädt alle heutigen Events rein!
/*
function displayAllEvents() {
    var events = [];
    var filterRootRef = rootRef.startAt(todayStartDateAndTime()).endAt(todayEndDateAndTime());
    filterRootRef.once("value", function(snapshot) {
        console.log("was passiert hier");
        //console.log(snapshot.val().startdatum);
        //Jeder Event wird als Packe abgespeichert
        snapshot.forEach(function(childSnapshot) {
            events.push(childSnapshot.val());
            //console.log("WAS PASSIERT DA" + " " + events);
        });
        
        renderEventList(events);

    });
}
*/

function coverheute(){
    $cover = $('<div class="e_cover" >' + '</div>');
    $titel = $('<div class="e_title">' + ("<p>") + "TONI LOOS" + ("</p>") + '</div>');
    $cover.append( $titel );
    $startzeit = $('<div class="sTime">' + "HEUTE" + '</div>');
    $cover.append( $startzeit );
    
    $eintrag = $('<div class="eintrag">' + '</div>')
    $eintrag.appendTo('#eventlist-placeholder');
    $eintrag.append( $cover.css( "background-color", "#000000").css( "color", "#FFFFFF" ) );

  
  }



function displayEvents(todayStartDateAndTime, todayEndDateAndTime, htmlPlaceHolderDiv) {
        //coverheute();
    var newRootRef = rootRef.startAt(todayStartDateAndTime).endAt(todayEndDateAndTime);
    newRootRef.on("child_added", function(snapshot) {
        //Jeder Event wird als Packe abgespeichert
        console.log(snapshot);
        console.log("NEUE EVENT GADDED, WELI CHÖME?")
        var events = [];
        events.push(snapshot.val());
        console.log("gits e Snapshot?");
        console.log(events);
        //events = snapshot.val();
        renderEventList(events, htmlPlaceHolderDiv)
        });

        
    
}

//Jetzt wird durch jedes Packe durchgezählt und die Klasse
// displayEventItem gestartet
function renderEventList(events, htmlPlaceHolderDiv) {
  console.log("Lenge vom Events" + events.length);
    $.each(events,function(i,eventItem) {
        console.log("chunter is rendere ine?")
        console.log(eventItem)



        displayEventItem(eventItem, htmlPlaceHolderDiv);
    });
}
//css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe )
//Hier werden die Covers und die Contents mit HTML erstellt und 
//mit den passenden Daten aus Firebase gefüllt
function displayEventItem(eventItem, htmlPlaceHolderDiv) {
    console.log(eventItem.sDatum);
    $cover = $('<div class="e_cover" >' + '</div>');
    $titel = $('<div class="e_title">' + ("<p>") + eventItem.titel + ("</p>") + '</div>');
    $cover.append( $titel );
    $startzeit = $('<div class="sTime">' + eventItem.startzeit + '</div>');
    $cover.append( $startzeit );

    
    $eintrag = $('<div class="eintrag">' + '</div>')
    $eintrag.appendTo(htmlPlaceHolderDiv);
    $eintrag.append( $cover.css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe ) );

    $content = $('<div class="e_content" >' + '</div>');
    $etage = $('<div class="etage">' + ("<h3>") + "ÉTAGE" + ("</h3>") + ("<p>") + eventItem.etage + ("</p>") + '</div>');
    $content.append( $etage );
    
    $endzeit = $('<div class="eTime">' + ("<h3>") + "ENDZEIT" + ("</h3>") + ("<p>")+ eventItem.endzeit + ("</p>") + '</div>');
    $content.append( $endzeit );
    $raum = $('<div class="raum">' + ("<h3>") + "RAUM" + ("</h3>") + ("<p>") + eventItem.raum + ("</p>") + '</div>');
    $content.append( $raum );
    $inkurze = $('<div class="inkurze">' + ("<h3>") + "IN KÜRZE" + ("</h3>") + ("<p>") + eventItem.inKurze + ("</p>") + '</div>');
    $content.append( $inkurze );
    
    $eintrag.append( $content.css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe ) );
    
    
    console.log("finish writing");
    console.log(eventItem.titel);
}




$(document).ready(function(){


  
    //Hier kommt ein Reload Button hin --> location.reload(true);
    //$seite wird deklariert und initialisiert mit einer html section und zwei klassen sowie einer ID
    // setInterval(function() {
    // var p = $( ".scrollbox" );
    // var position = p.position();
    // console.log("scrollbox position" + position.top);
    // if(position.top > 100){
    //     window.location.reload(true);
    //     console.log("RELOAD GO GOGO OOOO ::::::");
    // }
    // }, 500);

//PULL TO REFRESH
// var RB = new RubberBand(function(e) {
//         console.log("DOES IT FUCKING WORK WITH THE PULL SHIT?");
//         // make your call to AJAX or simply reload the page
//         location.reload();
        
//         // don't forget to close RubberBand when you're done.
//         e.close();

//     });
//PULL TO REFRESH   
//Gibt dem INPUT Feld das aktuelle Startdatum mit!


    // swal({
    //   title: "Error!",
    //   text: "Here's my error message!",
    //   type: "error",
    //   confirmButtonText: "Cool"
    // });
// $('#heute-Cover').waypoint(function() {
//   alert('100 pixels from the top heute');
//   $(".titel").text("HEUTE");
// }, { offset: 100 })

// $('#morgen').waypoint(function() {
//   alert('100 pixels from the top heute');
//   $(".titel").text("ÜBERMORGEN");
// }, { offset: 200 })
// $('#ubermorgen-cover').waypoint(function() {
//   alert('100 pixels from the top morgen');
// }, { offset: 100 });


$(".scrollbox").on("scroll", function(){

if($(".page#home").is(":visible") ){
  $('#heute-Cover').waypoint(function() {
  $(".titel").text("HEUTE");
  //console.log("heute cover drin ==")
}, { offset: 400 });
  $('#morgen').waypoint(function() {
  $(".titel").text("MORGEN");
  //console.log("morgen cover drin ==")
}, { offset: 200 });
  $('#ubermorgen-Cover').waypoint(function() {
  $(".titel").text("ÜBERMORGEN");
  //console.log("übermorgen cover drin ==")
}, { offset: 200 });
};
});




$(".menuebutton").load('img/hamburger2-01.svg',function(response){});
$(".addButton").load('img/plus2-01.svg',function(response){});
$(".cancleButton").load('img/plus2-01.svg',function(response){});



    var $seite = $( '<section class="scrollbox out_right" id="edit"></section>' );
    //edit page ins home reinladen

    $( ".addButton" ).click(function( e ) {
        
        $(".titel").text("EINTRAG").velocity({
                             duration: 5000,
                             
                         },"easeInSine");
        
        
        $(".addButton").hide();
        $(".cancleButton").show();
        $(".cancleButton").velocity({
            display: "block",
            rotateZ: "45deg",
            duration: 5000,
            //opacity: 0
            
        });
        $(".cancleButton").on("click", function(){
                         $( '.page#home' ).show().velocity({
                            duration: 5000
                         });
                         $seite.addClass( 'out_right' );
                         $seite.remove();
                         $(".titel").text("TONI LOOS").velocity({
                
                             
                             duration: 5000
                             
                         });
                         $(".cancleButton").hide();
                         
                         $(".addButton").velocity({
                
                             rotateZ: "0deg",
                             duration: 5000,
                             opacity: 1
                         }).show();
                         
        });
        //$(".addButton").hide();
    
        
        $(".scrollbox").scrollTop();

        console.log( '> click @ Button element' );
        
        // Erzeuge neue 'page' Section und füge sie unter .page#hone ein
        $( '.page#home' ).after( $seite );
        
        // Lade die edit-Seite und davon nur die id edit
        $seite.load( 'e_edit.html #edit', function( e ) { 
            //$(".navi.titel").scrollIntoView(true);
            $("#cancle").click(function(){

                        $( '.page#home' ).show();
                         $seite.addClass( 'out_right' );
                         
                         $(".titel").text("TONI LOOS").velocity({
                
                             
                             duration: 5000
                             
                         });
                         $seite.remove();
                         $(".cancleButton").hide();
                         
                         $(".addButton").velocity({
                
                             rotateZ: "0deg",
                             duration: 5000,
                             opacity: 1
                         }).show();

        
    });
              fontColor = 0;
              bgColor   = 0;

              auswahlBGFarbe();
              auswahlFontFarbe();
            console.log( '> complete @ $seite.load' );
            // Seite ist geladen worden, starte Slide Animation
            $seite.removeClass( 'out_right' );
            $('.page#home').velocity({
                            duration: 5000, 
                         });
            $('.page#home').hide();
            //$( '.page#home' ).addClass( 'out_left_new' );
            //$( '.navi#addButton').remove();
            //$( '.menubutton#back' ).show();
            document.getElementById('startdatum').value = new Date().toISOString().substring(0, 10);
            //document.getElementById('enddatum').value = new Date().toISOString().substring(0, 10);
            
            
            // $("#startdatum").on("focusout", function(){
            //   var startzeitDatum = document.getElementById('startdatum').value;
            //   document.getElementById('enddatum').value = startzeitDatum;
            //   console.log("enddatum" + " " + enddatum);
            // })

            $("#startzeit").on("focusout", function(){
              var startzeitElement = document.getElementById('startzeit').value;
              document.getElementById('endzeit').value = startzeitElement;
              console.log("endzeit" + " " + endzeit);
            })
            
            


            $( '#formDefault' ).on("click" , "#submitButton", function( e ) {
                //console.log( "WICHTIG" + '> click @ .menubutton#back' );
                //console.log("hhz" + $("#title").val())
                if($("#title").val()=="" || $("#etage").val()=="" || $("#raum").val()==""  || $("#inkurze").val()=="" || bgColor === 0 || fontColor === 0){
                    // Schiebe Seiten wieder raus
                    swal({
                      title: "BITTE ALLE FELDER AUSFÜLLEN",
                      //text: "BITTE ALLE FELDER AUSFÜLLEN!",
                      type: "",
                      confirmButtonText: "LOOS"
                    });
                    
                    //$(".addButton").show();
                    //$( '.page#home' ).addClass( 'out_right' );
                    //$( '.page#edit' ).addClass( 'out_left_new' );
                    //$( '.menubutton#back' ).hide();
                } else {
                         $( '.page#home' ).show().velocity({
                            duration: 5000
                         });
                         //$(".page#home").scrollTop();
                         $seite.addClass( 'out_right' );
                         //$seite.remove();
                         $(".titel").text("TONI LOOS").velocity({
                            duration: 5000
                         });
                         $(".cancleButton").hide();
                         
                         $(".addButton").velocity({
                
                             rotateZ: "0deg",
                             duration: 5000,
                             opacity: 1
                         }).show();
                         window.location.reload();

                }
                //$(".navi.titel").scrollIntoView(true);
            });

        });
        
    });
    
    //menue aufklappen
    $( ".menuebutton" ).click(function() {
          console.log("funktioniert dr toggle?")
        //$( ".menue " ).toggleClass( "showmenue" );
        $( ".navi" ).toggleClass( "pushright" );
        $( ".scrollbox" ).toggleClass( "pushright" );
        //window.location.reload(true);
        $("#backMainApp").click(function(){
          window.location.href="../../../toni_areal_server";
        });
        $("#meineEintrage1, #meineEintrage2").click(function (){
          swal({
                      title: "DIESER BEREICH IST ERST IN V.2 AKTIV",
                      //text: "BITTE ALLE FELDER AUSFÜLLEN!",
                      type: "",
                      confirmButtonText: "OK"
                    });
        });
    });

    $(".titel").click(function(){
        window.location.reload(true);
    });
// $content_bg_red: #CF3933;
// $content_bg_violet: #720CE8;
// $content_bg_yellow: #EBD942;
// $content_bg_green: #44919A;


// //fonts edit
// $content_f_red: #F70707;
// $content_f_white: #ffffff
// $content_f_pink: #F90859;
// $content_f_blue: #28AAFF;
// label{
//  margin: 1em;
// }
    function auswahlBGFarbe(){
        $("#bg_c_rot").on("click",function(e){
          bgColor = "#ED3232";
          console.log("ischer clicked dr rot")
          
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        });

        $("#bg_c_violet").click(function(){
          bgColor = "#720CE8";
          console.log("ischer clicked dr violette")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        });
        $("#bg_c_grun").click(function(){
          bgColor = "#01BC4B";
          console.log("ischer clicked dr grün")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        
        });
        $("#bg_c_gelb").click(function(){
          bgColor =  "#EBD942";
          console.log("ischer clicked dr gelb")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
        //  return color;
        
        });




        // if($("#bg_c_rot").is.clicked = true){
        //   var color = "#CF3933";
        //   console.log("ischer clicked dr rot")
        //     return color;
        //   } else if ($("#bg_c_violet").prop('checked') == true){
        //     var color = "#720CE8";
        //     return color;
        // } else if ($("#bg_c_grun").prop('checked') == true){
        //     var color = "#44919A";
        //     return color;
        // } else if ($("#bg_c_gelb").prop('checked') == true){
        //     var color = "#EBD942";
        //     return color;
        // } else {
        //     var color = "#44919A";
        //     return color;
        // }
    }



    //edit zuklappen
   function auswahlFontFarbe(){
       $("#font_c_rot").on("click",function(e){
          fontColor = "#931818";
          console.log("ischer clicked dr rot")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );

        
        });
        $("#font_c_white").on("click",function(e){
          fontColor = "#F5F5F5";
          console.log("ischer clicked dr violette")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );
        
        });
        $("#font_c_pink").on("click",function(e){
          fontColor = "#E03F75";
          console.log("ischer clicked dr grün")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );
        
        });
        $("#font_c_blue").on("click",function(e){
          fontColor =  "#5E9DFF";
          console.log("ischer clicked dr gelb")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
        
        });
   };


   // function uploadImage(){
   //  console.log("uploadImage");
   //  var file = $("#camera")[ 0 ].files[ 0 ];
   //  console.log("fill:"+ file);

   //  /* Is the file an image? */
   //      if (!file || !file.type.match(/image.*/)) return;

   //      /* It is! */
   //      document.body.className = "uploading";

   //      /* Lets build a FormData object*/
   //      var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
   //      fd.append("image", file); // Append the file
   //      var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
   //      xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
   //      xhr.onload = function() {
   //          // Big win!
   //          // document.querySelector("#link").href = JSON.parse(xhr.responseText).data.link;
   //          // document.body.className = "uploaded";

   //          var submit = (JSON.parse(xhr.responseText).data.link);
   //          return submit;
            
   //      }
   //      xhr.setRequestHeader('Authorization', 'Client-ID 19de3012e83ed23'); // Get your own Client-ID at http://api.imgur.com/
        
   //      // Ok, I don't handle the errors. An exercise for the reader.

   //      /* And now, we send the formdata */
   //      xhr.send(fd);
    
   // }

   // function sentToSubmitFunkction(link){
   //  return link;

   // }



    $(document).on("submit", "#formDefault", function (e) {
        e.preventDefault();
        if($("#title").val()=="" || $("#etage").val()=="" || $("#raum").val()=="" || $("#landmark").val()=="" || $("#inkurze").val()=="" || bgColor ===0 || fontColor ===0) {
            return
        }

        // HANI ICH IRGENDWIE E ID BECHO? JA? -> EDIT MODE, NEI -> INSERT MODE


        //auswahlBGFarbe();
        //jetzt wird der Inhalt von #nameInput per .val in die Variable geladen
        var titel       =   ($("#title").val()).toUpperCase();
        var sDatum      =   $("#startdatum").val();
        var sZeit       =   $("#startzeit").val();
        //var eDatum      =   $("#enddatum").val();
        var eZeit       =   $("#endzeit").val();

        var eEtage      =   ($("#etage").val()).toUpperCase();
        var eRaum       =   ($("#raum").val()).toUpperCase();
        //var eLandmark   =   ($("#landmark").val()).toUpperCase();

        var inkurze     =   ($("#inkurze").val()).toUpperCase();
       
        //var fontColor   =   auswahlFontFarbe();
        console.log("weli BG Farb isches??" + " " + bgColor);
        console.log("weli Font Farb isches??" + " " + fontColor);
        var camera      =   ("");//uploadImage();

        var bigsDatesTime = (sDatum + sZeit);
        var sDatesTime = creatDateAndTime(bigsDatesTime);
        console.log("STARTZEIT VOM EVENT");
        console.log(sDatesTime);

        // Inhalte name & text in Variablen. diese müssen an Firebase gepushed werden
        //setWithPriority wird am schluss mit json angegeben. json=datum --> siehe oben
        //var cnewRootRef = rootRef.push().setWithPriority({titel: titel, startdatum: sDatum, startzeit: sZeit, enddatum: eDatum, endzeit: eZeit, etage: eEtage, raum: eRaum, landmark: eLandmark, inKurze: inkurze, hintergrundfarbe: bgColor, schriftfarbe: fontColor, bild: camera}, sDatesTime);


        //EDIT MODE? -> SET... (update item), INSERT MODE? -> push (new item)

        var cnewRootRef = rootRef.push().setWithPriority({titel: titel, startdatum: sDatum, startzeit: sZeit, endzeit: eZeit, etage: eEtage, raum: eRaum, inKurze: inkurze, hintergrundfarbe: bgColor, schriftfarbe: fontColor, bild: camera},sDatesTime);

        // var myEvents = JSON.parse(localStorage.getItem('myEvents'));
        
        // if(myEvents === null || myEvents === undefined) {
        //     myEvents = new Array(); 
        // }

        // myEvents.push(cnewRootRef.name());
        // localStorage.setItem('myEvents',JSON.stringify(myEvents));

        // console.log(myEvents);


        // SO HET DE ROEBI FREUD
        // var data = {};

        // data.titel       =   $("#title").val();
        // data.sDatum      =   $("#startdatum").val();



        // rootRef.push().setWithPriority(data, sDatesTime);

        //inputfelder werden geleert
        $("#title").val('');
        $("#startdatum").val('');
        $("#startzeit").val('');
        //$("#enddatum").val('');
        $("#endzeit").val('');
        $("#inkurze").val('');
        //$("#camera").val('');
        //displayEvents();
    });
      function tagesAnzeige(){
      var tagesAnzeige = {
    "bild" : "",
    "enddatum" : "2014-10-14",
    "endzeit" : "22:00",
    "etage" : "7",
    "hintergrundfarbe" : "#000000",
    "inKurze" : "CHÄS BROT U DS TRINKE",
    "landmark" : "NACHEM LANGE GANG",
    "raum" : "E.33",
    "schriftfarbe" : "#FFFFFF",
    "startdatum" : "2014-10-14",
    "startzeit" : "HEUTE",
    "titel" : "TONI LOOS"}
    return tagesAnzeige;
    }
    //
    //displayAllEvents();
    currentTime();
    //coverheute();
    function htmlPlaceHolderDivHeute(){
      var place = "#eventlist-placeholderHeute";
      return place;
    }function htmlPlaceHolderDivMorgen(){
      var place = "#eventlist-placeholderMorgen";
      return place;
    }function htmlPlaceHolderDivUbermorgen(){
      var place = "#eventlist-placeholderUbermorgen";
      return place;
    }

    displayEvents(todayStartDateAndTime(),todayEndDateAndTime(),htmlPlaceHolderDivHeute());
    displayEvents(tomorrowStartDateAndTime(),tomorrowEndDateAndTime(),htmlPlaceHolderDivMorgen());
    displayEvents(tomorrowPlusOneStartDateAndTime(),tomorrowPlusOneEndDateAndTime(),htmlPlaceHolderDivUbermorgen());





    //covers ansteuern und content zeigen
    $("#eventlist-placeholderHeute, #eventlist-placeholderMorgen, #eventlist-placeholderUbermorgen").on("click", ".eintrag", function(event){
        event.stopPropagation();
        event.preventDefault();
        var element = $(this).closest(".eintrag").find(".e_content");
         var alreadyOpen = element.is(":visible") 

        $(".e_content").hide().fadeOut("slow");
        if(!alreadyOpen)
            element.show().fadeIn().delay(200);
            // element.show().fadeIn("slow");
            //show().fadeIn("slow");
        this.scrollIntoView(true);

        console.log("passiert was");
    });
})

