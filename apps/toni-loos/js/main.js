var rootRef;
// root zur Firebase Datenbank
rootRef = new Firebase('https://incandescent-inferno-8047.firebaseio.com/');
function todayDate () {
//Heutiges Datum
var fullDate = new Date();console.log(fullDate);
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






function creatDateAndTime(sDatesTime){
        sDatesTime = sDatesTime.replace('-','');
        sDatesTime = sDatesTime.replace('-','');
        sDatesTime = sDatesTime.replace(':','');
        return sDatesTime;
}

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
function displayEvents() {
    var newRootRef = rootRef.startAt(todayStartDateAndTime()).endAt(todayEndDateAndTime());
    newRootRef.on("child_added", function(snapshot) {
        //Jeder Event wird als Packe abgespeichert
        console.log(snapshot);
        console.log("NEUE EVENT GADDED, WELI CHÖME?")
        var events = [];
        events.push(snapshot.val());
        console.log("gits e Snapshot?");
        console.log(events);
        //events = snapshot.val();
        renderEventList(events)
        });

        
    
}

//Jetzt wird durch jedes Packe durchgezählt und die Klasse
// displayEventItem gestartet
function renderEventList(events) {
    $.each(events,function(i,eventItem) {
        console.log("chunter is rendere ine?")
        console.log(eventItem)
        displayEventItem(eventItem);
    });
}
//css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe )
//Hier werden die Covers und die Contents mit HTML erstellt und 
//mit den passenden Daten aus Firebase gefüllt
function displayEventItem(eventItem) {
    console.log(eventItem.sDatum);
    $cover = $('<div class="e_cover" >' + '</div>');
    $titel = $('<div class="e_title">' + ("<p>") + eventItem.titel + ("</p>") + '</div>');
    $cover.append( $titel );
    $startzeit = $('<div class="sTime">' + eventItem.startzeit + '</div>');
    $cover.append( $startzeit );
    
    $eintrag = $('<div class="eintrag">' + '</div>')
    $eintrag.appendTo('#eventlist-placeholder');
    $eintrag.append( $cover.css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe ) );

    $content = $('<div class="e_content" >' + '</div>');
    $etage = $('<div class="etage">' + ("<h3>") + "ÉTAGE" + ("</h3>") + ("<p>") + eventItem.etage + ("</p>") + '</div>');
    $content.append( $etage );
    $raum = $('<div class="raum">' + ("<h3>") + "RAUM" + ("</h3>") + ("<p>") + eventItem.raum + ("</p>") + '</div>');
    $content.append( $raum );
    $endzeit = $('<div class="eTime">' + ("<h3>") + "ENDZEIT" + ("</h3>") + ("<p>")+ eventItem.endzeit + ("</p>") + '</div>');
    $content.append( $endzeit );
    $landmark = $('<div class="landmark">' + ("<h3>") + "LANDMARK" + ("</h3>") + ("<p>") + eventItem.landmark + ("</p>") + '</div>');
    $content.append( $landmark );
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


$(".menuebutton").load('img/hamburger2-01.svg',function(response){});
$(".addButton").load('img/plus2-01.svg',function(response){});



    var $seite = $( '<section class="scrollbox out_right" id="edit"></section>' );

    //edit page ins home reinladen
    $( ".addButton" ).click(function( e ) {
        
        
        $(this).velocity({
        
            rotateZ: "45deg",
            duration: 5000,
            opacity: 0
            
        });
        //$(".addButton").hide();
    
        


        console.log( '> click @ Button element' );
        
        // Erzeuge neue 'page' Section und füge sie unter .page#hone ein
        $( '.page#home' ).after( $seite );
        
        // Lade die edit-Seite und davon nur die id edit
        $seite.load( 'e_edit.html #edit', function( e ) { 
            //$(".navi.titel").scrollIntoView(true);
            $("#cancle").click(function(){
         $( '.page#home' ).show();
                    $seite.addClass( 'out_right' );
                    $seite.remove();
                    $(".addButton").velocity({
        
                        rotateZ: "0deg",
                        duration: 5000,
                        opacity: 1
                    });
    });
            console.log( '> complete @ $seite.load' );
            // Seite ist geladen worden, starte Slide Animation
            $seite.removeClass( 'out_right' );
            $('.page#home').hide();
            //$( '.page#home' ).addClass( 'out_left_new' );
            //$( '.navi#addButton').remove();
            //$( '.menubutton#back' ).show();
            document.getElementById('startdatum').value = new Date().toISOString().substring(0, 10);
document.getElementById('enddatum').value = new Date().toISOString().substring(0, 10);


            $( '#formDefault' ).on("click" , "#submitButton", function( e ) {
                console.log( "WICHTIG" + '> click @ .menubutton#back' );
                if($("#title").val() != 0){
                    // Schiebe Seiten wieder raus

                    $( '.page#home' ).show();
                    $seite.addClass( 'out_right' );
                    //$seite.remove();
                    $(".addButton").velocity({
        
                        rotateZ: "0deg",
                        duration: 5000,
                        opacity: 1
                    });
                    //$(".addButton").show();
                    //$( '.page#home' ).addClass( 'out_right' );
                    //$( '.page#edit' ).addClass( 'out_left_new' );
                    //$( '.menubutton#back' ).hide();
                }
                $(".navi.titel").scrollIntoView(true);
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
        if($("#bg_c_rot").prop('checked') == true){
            var color = "#CF3933";
            return color;
        } else if ($("#bg_c_violet").prop('checked') == true){
            var color = "#720CE8";
            return color;
        } else if ($("#bg_c_grun").prop('checked') == true){
            var color = "#44919A";
            return color;
        } else if ($("#bg_c_gelb").prop('checked') == true){
            var color = "#EBD942";
            return color;
        } else {
            var color = "#44919A";
            return color;
        }
    }



    //edit zuklappen
   function auswahlFontFarbe(){
        if($("#font_c_rot").prop('checked') == true){
            var color = "#931818";
            return color;
        } else if ($("#font_c_white").prop('checked') == true){
            var color = "#F5F5F5";
            return color;
        } else if ($("#font_c_pink").prop('checked') == true){
            var color = "#E03F75";
            return color;
        } else if ($("#font_c_blue").prop('checked') == true){
            var color = "#5E9DFF";
            return color;
        } else {
            var color = "#F70707";
            return color;
        }
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
        

        // HANI ICH IRGENDWIE E ID BECHO? JA? -> EDIT MODE, NEI -> INSERT MODE


        //auswahlBGFarbe();
        //jetzt wird der Inhalt von #nameInput per .val in die Variable geladen
        var titel       =   ($("#title").val()).toUpperCase();
        var sDatum      =   $("#startdatum").val();
        var sZeit       =   $("#startzeit").val();
        var eDatum      =   $("#enddatum").val();
        var eZeit       =   $("#endzeit").val();

        var eEtage      =   ($("#etage").val()).toUpperCase();
        var eRaum       =   ($("#raum").val()).toUpperCase();
        var eLandmark   =   ($("#landmark").val()).toUpperCase();

        var inkurze     =   ($("#inkurze").val()).toUpperCase();
        var bgColor     =   auswahlBGFarbe();
        var fontColor   =   auswahlFontFarbe();
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

        var cnewRootRef = rootRef.push().setWithPriority({titel: titel, startdatum: sDatum, startzeit: sZeit, enddatum: eDatum, endzeit: eZeit, etage: eEtage, raum: eRaum, landmark: eLandmark, inKurze: inkurze, hintergrundfarbe: bgColor, schriftfarbe: fontColor, bild: camera},sDatesTime);

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
        $("#title").val(' ');
        $("#startdatum").val(' ');
        $("#startzeit").val(' ');
        $("#enddatum").val(' ');
        $("#endzeit").val(' ');
        $("#inkurze").val(' ');
        //$("#camera").val(' ');
        //displayEvents();
    });
    
    //
    //displayAllEvents();
    currentTime();
    displayEvents();






    //covers ansteuern und content zeigen
    $("#eventlist-placeholder").on("click", ".eintrag", function(event){
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

