var rootRef;
// root zur Firebase Datenbank
rootRef = new Firebase('https://incandescent-inferno-8047.firebaseio.com/');
 var fontColor;
 var bgColor;
 var startDatum;
 var startDatumHeute;
 

//START DER ZEITKISTE
/////////
///////
//////
function todayDate () {
//Heutiges Datum
var fullDate = Date.today().add(0).days();
//console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
//console.log(currentDate);
return currentDate;
}
function tomorrowDate () {
//Heutiges Datum
var fullDate = Date.today().add(1).days();
//console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
//console.log(currentDate);
return currentDate;
}
function tomorrowPlusOneDate () {
//Heutiges Datum
var fullDate = Date.today().add(2).days();
//console.log(fullDate);
var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
var currentDate = fullDate.getFullYear() + twoDigitMonth + twoDigitDate;
//console.log(currentDate);
return currentDate;
}


function currentTime() {
    var now = new Date();
    var nowH = now.getHours()+"";if(nowH.length==1) nowH="0" +nowH;
    var nowM = now.getMinutes()+"";;if(nowM.length==1) nowM="0" +nowM;
    var time = nowH + nowM;
    //console.log("WAS ISCH DIE AKTUELLI ZIT?");
    //console.log(time);
    return time;

}

function todayStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = todayDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
    //console.log("HEUTIGES STARTDATUM MIT ZEIT")
    //console.log(timeAndDate);
    return timeAndDate;
}


function todayEndDateAndTime (){
    var currentDate = todayDate();
    var timeAndDate = currentDate +2+3+5+9;
    //console.log("HEUTIGES ENDDATUM")
    //console.log(timeAndDate);
    return timeAndDate;
}
function tomorrowStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = tomorrowDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
    //console.log("HEUTIGES STARTDATUM MIT ZEIT")
    //console.log(timeAndDate);
    return timeAndDate;
}


function tomorrowEndDateAndTime (){
    var currentDate = tomorrowDate();
    var timeAndDate = currentDate +2+3+5+9;
    //console.log("HEUTIGES ENDDATUM")
    //console.log(timeAndDate);
    return timeAndDate;
}

function tomorrowPlusOneStartDateAndTime (){
    //var aktuelleZeit = currentTime();
    var aktuelleZeit = 0000;
    var currentDate = tomorrowPlusOneDate();
    var timeAndDate = currentDate + aktuelleZeit;//currentTime();
  // console.log("HEUTIGES STARTDATUM MIT ZEIT")
  // console.log(timeAndDate);
    return timeAndDate;
}


function tomorrowPlusOneEndDateAndTime (){
    var currentDate = tomorrowPlusOneDate();
    var timeAndDate = currentDate +2+3+5+9;
   // console.log("HEUTIGES ENDDATUM")
   // console.log(timeAndDate);
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

function displayEvents(todayStartDateAndTime, todayEndDateAndTime, htmlPlaceHolderDiv) {
        //coverheute();
    var newRootRef = rootRef.startAt(todayStartDateAndTime).endAt(todayEndDateAndTime);
    newRootRef.on("child_added", function(snapshot) {
        //Jeder Event wird als Packe abgespeichert
        //console.log(snapshot);
        //console.log("NEUE EVENT GADDED, WELI CHÖME?")
        var events = [];
        events.push(snapshot.val());
       //console.log("gits e Snapshot?");
       //console.log(events);
        //events = snapshot.val();
        renderEventList(events, htmlPlaceHolderDiv)
        });   
}

//Jetzt wird durch jedes Packe durchgezählt und die Klasse
// displayEventItem gestartet
function renderEventList(events, htmlPlaceHolderDiv) {
  //console.log("Lenge vom Events" + events.length);
    $.each(events,function(i,eventItem) {
       //console.log("chunter is rendere ine?")
       //console.log(eventItem)
        displayEventItem(eventItem, htmlPlaceHolderDiv);
    });
}
//css( "background-color", eventItem.hintergrundfarbe).css( "color", eventItem.schriftfarbe )
//Hier werden die Covers und die Contents mit HTML erstellt und 
//mit den passenden Daten aus Firebase gefüllt
function displayEventItem(eventItem, htmlPlaceHolderDiv) {
    //console.log(eventItem.sDatum);
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
    
    
    //console.log("finish writing");
    //console.log(eventItem.titel);
}




$(document).ready(function(){

startDatumHeute = todayDate();


    // swal({
    //   title: "Error!",
    //   text: "Here's my error message!",
    //   type: "error",
    //   confirmButtonText: "Cool"
    // });



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


    //seite enhält eine section mit zwei classes und einer id
    var $seite = $( '<section class="scrollbox out_right" id="edit"></section>' );
    //edit page ins home reinladen

    $( ".addButton" ).click(function( e ) {
        $(".titel").text("EINTRAG").velocity({
                             duration: 5
                         },"easeIn");

        $(".addButton").hide();
        $(".cancleButton").show();
        $(".cancleButton").velocity({
            display: "block",
            rotateZ: "45deg",
            duration: 5000
            //opacity: 0
            
        });

        $(".cancleButton").on("click", function(){
          $seite.addClass( 'out_right' );
                         $( '.page#home' ).show();
                         $(".scrollbox").scrollTop(0);
                             
                         $seite.addClass( 'out_right' ).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){ $seite.remove() });
                         
                         $(".titel").text("TONI LOOS").velocity({
                             duration: 5000
                         },"easeInSine");
                         $(".cancleButton").hide();
                         
                         $(".addButton").velocity({
                             rotateZ: "0deg",
                             duration: 5000,
                             opacity: 1
                             
                         }).show();
                            
                               
        });
        //$(".addButton").hide();
    
        
        $(".scrollbox").scrollTop(0);

        //console.log( '> click @ Button element' );
        
        // Erzeuge neue 'page' Section und füge sie unter .page#hone ein
        $( '.page#home' ).after( $seite );
        
        // Lade die edit-Seite und davon nur die id edit
        $seite.load( 'e_edit.html #edit', function( e ) { 
            
        fontColor = 0;
        bgColor   = 0;

        auswahlBGFarbe();
        auswahlFontFarbe();
        //console.log( '> complete @ $seite.load' );
        // Seite ist geladen worden, starte Slide Animation
        $seite.removeClass( 'out_right' ).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){ $('.page#home').hide()});
        
        

        //document.getElementById('startdatum').value = new Date().toISOString().substring(0, 10);

        var startdatumSelect = document.getElementById("startdatumx");//$('select[name=StartdatumSelecten]')
        startdatumSelect.onchange = function() {
         var startDatum = this.value;
         
         console.log("startdatum Heute 1" + " " + startDatumHeute)

          if(startDatum == 1) {
            startDatumHeute = todayDate();
            console.log("datumHeute" + " " + startDatumHeute);
          } else if (startDatum == 2) {
          startDatumHeute = tomorrowDate();
          console.log("datumMorgen" + " " + startDatumHeute);
          } else if (startDatum == 3) {
          startDatumHeute = tomorrowPlusOneDate();
          console.log("datumÜbermorgen" + " " + startDatumHeute);
          }
          console.log("startdatum" + " " + startDatum);
        } 


        $("#startzeit").on("focusout", function(){
          var startzeitElement = document.getElementById('startzeit').value;
          document.getElementById('endzeit').value = startzeitElement;
          //console.log("endzeit" + " " + endzeit);
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
                     $( '.page#home' ).show();
                     //$(".page#home").scrollTop();
                     $(".titel").text("TONI LOOS").velocity({
                        duration: 5000
                     });
                     $(".cancleButton").hide();
                     
                     $(".addButton").show();
                     $seite.addClass( 'out_right' ).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){location.reload() });
                     //$seite.remove();
                     
                     

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
        if($(".navi").hasClass("pushright")){

            $(".scrollbox").swipe({
            swipeLeft:function() {
              //This only fires when the user swipes left
              $( ".navi" ).removeClass( "pushright" );
              $( ".scrollbox" ).removeClass( "pushright" );
            }
          })
        }
        //window.location.reload(true);
        $("#backMainApp").click(function(){
          window.location.href="../../";
        });
        $("#meineEintrage1, #meineEintrage2").click(function (){
          swal({
                      title: "DIESER BEREICH STEHT IN KÜRZE ZUR VERFÜGUNG",
                      //text: "BITTE ALLE FELDER AUSFÜLLEN!",
                      type: "",
                      confirmButtonText: "OK"
                    });
        });
    });

    $(".titel").click(function(){
        window.location.reload(true);
    });

    function auswahlBGFarbe(){
        $("#bg_c_rot").on("click",function(e){
          bgColor = "#ED3232";
         // console.log("ischer clicked dr rot")
          
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        });

        $("#bg_c_violet").click(function(){
          bgColor = "#720CE8";
          //console.log("ischer clicked dr violette")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        });
        $("#bg_c_grun").click(function(){
          bgColor = "#05a444";
          //console.log("ischer clicked dr grün")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_gelb" ).removeClass( "clickedColor" );
        
        });
        $("#bg_c_gelb").click(function(){
          bgColor =  "#EBD942";
         // console.log("ischer clicked dr gelb")
          $( this ).addClass( "clickedColor" );
          $( "#bg_c_rot" ).removeClass( "clickedColor" );
          $( "#bg_c_violet" ).removeClass( "clickedColor" );
          $( "#bg_c_grun" ).removeClass( "clickedColor" );
        //  return color;
        
        });
    }



    //edit zuklappen
   function auswahlFontFarbe(){
       $("#font_c_rot").on("click",function(e){
          fontColor = "#ED3232";
         // console.log("ischer clicked dr rot")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );
        });
        $("#font_c_white").on("click",function(e){
          fontColor = "#F5F5F5";
         // console.log("ischer clicked dr violette")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );
        });
        $("#font_c_pink").on("click",function(e){
          fontColor = "#EBD942";
         // console.log("ischer clicked dr grün")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_blue" ).removeClass( "clickedColor" );
        });
        $("#font_c_blue").on("click",function(e){
          fontColor =  "#5E9DFF";
         // console.log("ischer clicked dr gelb")
          $( this ).addClass( "clickedColor" );
          $( "#font_c_rot" ).removeClass( "clickedColor" );
          $( "#font_c_white" ).removeClass( "clickedColor" );
          $( "#font_c_pink" ).removeClass( "clickedColor" );
        });
   };



    $(document).on("submit", "#formDefault", function (e) {
        e.preventDefault();
        if($("#title").val()=="" || $("#etage").val()=="" || $("#raum").val()=="" || $("#landmark").val()=="" || $("#inkurze").val()=="" || bgColor ===0 || fontColor ===0) {
            return
        }

        // HANI ICH IRGENDWIE E ID BECHO? JA? -> EDIT MODE, NEI -> INSERT MODE


        //auswahlBGFarbe();
        //jetzt wird der Inhalt von #nameInput per .val in die Variable geladen
        var titel       =   ($("#title").val()).toUpperCase();
        var sDatum      =   startDatumHeute; //$("#startdatum").val();
        console.log("sDatum" + " " + sDatum);
        var sZeit       =   $("#startzeit").val();
        //var eDatum      =   $("#enddatum").val();
        var eZeit       =   $("#endzeit").val();

        var eEtage      =   ($("#etage").val()).toUpperCase();
        var eRaum       =   ($("#raum").val()).toUpperCase();
        //var eLandmark   =   ($("#landmark").val()).toUpperCase();

        var inkurze     =   ($("#inkurze").val()).toUpperCase();
       
        //var fontColor   =   auswahlFontFarbe();
        //console.log("weli BG Farb isches??" + " " + bgColor);
        //console.log("weli Font Farb isches??" + " " + fontColor);
        var camera      =   ("");//uploadImage();

        var bigsDatesTime = (sDatum + sZeit);
        console.log(bigsDatesTime);
        var sDatesTime = creatDateAndTime(bigsDatesTime);
        //console.log("STARTZEIT VOM EVENT");
        //console.log(sDatesTime);

        // Inhalte name & text in Variablen. diese müssen an Firebase gepushed werden
        //setWithPriority wird am schluss mit json angegeben. json=datum --> siehe oben
        //var cnewRootRef = rootRef.push().setWithPriority({titel: titel, startdatum: sDatum, startzeit: sZeit, enddatum: eDatum, endzeit: eZeit, etage: eEtage, raum: eRaum, landmark: eLandmark, inKurze: inkurze, hintergrundfarbe: bgColor, schriftfarbe: fontColor, bild: camera}, sDatesTime);


        //EDIT MODE? -> SET... (update item), INSERT MODE? -> push (new item)

        //var cnewRootRef = rootRef.push().setWithPriority({titel: titel, startdatum: sDatum, startzeit: sZeit, endzeit: eZeit, etage: eEtage, raum: eRaum, inKurze: inkurze, hintergrundfarbe: bgColor, schriftfarbe: fontColor, bild: camera},sDatesTime);

 


        // SO HET DE ROEBI FREUD  
       
        var data = {};

        data.titel             =   ($("#title").val()).toUpperCase();
        data.startdatum        =   startDatumHeute;//$("#startdatum").val();
        data.startzeit         =   $("#startzeit").val();
        data.endzeit           =   $("#endzeit").val();
        data.etage             =   ($("#etage").val()).toUpperCase();
        data.raum              =   ($("#raum").val()).toUpperCase();
        data.inKurze           =   ($("#inkurze").val()).toUpperCase();
        data.hintergrundfarbe  =   bgColor;
        data.schriftfarbe      =   fontColor;

        console.log(data)

       var cnewRootRef = rootRef.push().setWithPriority(data, sDatesTime);
       // var myEvents = JSON.parse(localStorage.getItem('myEvents'));
        
       //  if(myEvents === null || myEvents === undefined) {
       //      myEvents = new Array(); 
       //  }
        
        // myEvents.push(cnewRootRef.name());
        // localStorage.setItem('myEvents',JSON.stringify(myEvents));

        // console.log(myEvents);



        //inputfelder werden geleert
        $("#title").val('');
        //$("#startdatum").val('');
        $("#startzeit").val('');
        //$("#enddatum").val('');
        $("#endzeit").val('');
        $("#inkurze").val('');
        //$("#camera").val('');
        //displayEvents();
    });

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

        $(".e_content").hide();
        if(!alreadyOpen)
            element.show();
            // element.show().fadeIn("slow");
            //show().fadeIn("slow");
        this.scrollIntoView(true);

        console.log("passiert was");
    });
})

