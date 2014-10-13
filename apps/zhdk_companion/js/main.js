$(document).ready(function() {

var body = document.getElementById('body');
var bodyEm = getEmPixels(body);
var rem = getEmPixels();
var bodyEmWidth = body.clientWidth / bodyEm;
var bodyRemWidth = body.clientWidth / rem;

var today = new Date(moment().valueOf()),
    now = moment(),
    tomorrow = moment().add(1, 'd'),
    touchStart = {x: 0, y: 0},
    touchMove = {x: 0, y: 0},
    pullStart = {x: 0, y: 0},
    pullMove = {x: 0, y: 0},
    $pagesWrapper = $('#pagesWrapper'),
    $mensa = $('#mensa'),
    scrollPosX = 0,
    menuLabel = "mensa",
    $menu = $('#menu'),
    pagesWidth = $(window).width(),
    touchEnded = false,
    pullEnded = false,
    animationDelayMensa = 0,
    animationDelayAgenda = 0,
    agendaDayIndex = 0,
    agendaDayIndexOld = 0,
    eventTimeFromTo = null;

$(window).on("orientationchange", function(event) {
    location.reload();
});

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};

moment.locale("de");
var months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
var dayOfWeek = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

// ANIMATIONS


//SNAPPING
// var touchMoveFunction = debounce( function(e) {
//     touchMove.x = e.originalEvent.changedTouches[0].clientX;
//     touchMove.y = e.originalEvent.changedTouches[0].clientY;

//     if(Math.abs(touchMove.x - touchStart.x) > 10 && Math.abs(touchMove.y - touchStart.y) < 100) {
//         $pagesWrapper.animate({
//             scrollLeft: scrollPosX + touchStart.x - touchMove.x
//         }, 0);
//     }
// },16)

$pagesWrapper.on('touchstart', function(e) {
    touchEnded = false;
    touchStart.x = e.originalEvent.changedTouches[0].clientX;
    touchStart.y = e.originalEvent.changedTouches[0].clientY;
    scrollPosX = $pagesWrapper.scrollLeft();
});

$pagesWrapper.on('touchmove', function(e) {
    touchMove.x = e.originalEvent.changedTouches[0].clientX;
    touchMove.y = e.originalEvent.changedTouches[0].clientY;

    debounce(animateScroll(), 16, false);
    
});

$pagesWrapper.on('touchend', function(e) {
    touchEnded = true;
    snapPages();
});

function animateScroll() {
    if(Math.abs(touchMove.x - touchStart.x) > 10 && Math.abs(touchMove.y - touchStart.y) < 50) {
        //window.requestAnimationFrame(function () { 
            
            if(!touchEnded) {
                $pagesWrapper.animate({
                    scrollLeft: scrollPosX + (touchStart.x - touchMove.x)*1.4
                }, 10);
                //$pagesWrapper.scrollLeft(scrollPosX + (touchStart.x - touchMove.x)*1.4);
            }
        //});
    }
};


// $mensa.on('touchstart', function(e) {
//     pullEnded = false;
//     if($mensa.scrollTop() == 0) {
//         pullStart.x = e.originalEvent.changedTouches[0].clientX;
//         pullStart.y = e.originalEvent.changedTouches[0].clientY;
//     }
// });

// $mensa.on('touchmove', function(e) {
//     if($mensa.scrollTop() <= 0) {
//         pullMove.x = e.originalEvent.changedTouches[0].clientX;
//         pullMove.y = e.originalEvent.changedTouches[0].clientY;
           
//         if(!pullEnded) {
//             console.log();
//             $mensa.css('padding-top: ' + Math.abs(pullStart.y - pullMove.y));
//         }
//     }
// });

// $mensa.on('touchend', function(e) {
//     pullEnded = true;
//     console.log('pulled');
// });



var snapPages = function() {
    scrollPosX = $pagesWrapper.scrollLeft();
    if(scrollPosX/pagesWidth <= 0.5) {
        $pagesWrapper.animate({
            scrollLeft: 0
        }, 140);
        menuLabel = "mensa";
    } else if(scrollPosX/pagesWidth > 0.5 && scrollPosX/pagesWidth <= 1.5) {
        $pagesWrapper.animate({
            scrollLeft: pagesWidth
        }, 140);
        menuLabel = "agenda";
    } else if(scrollPosX/pagesWidth > 1.5 && scrollPosX/pagesWidth <= 2.5) {
        $pagesWrapper.animate({
            scrollLeft: pagesWidth*2
        }, 140);
        menuLabel = "tram";
    }
    $menu.html(menuLabel);
};

// MENU -----------------------------------------------------------------------------------
// $pagesWrapper.scroll(function () {
//     scrollPosX = $pagesWrapper.scrollLeft();
//     if(scrollPosX/pagesWidth <= 0.5) {
//     	menuChar = "mensa";
//     } else if(scrollPosX/pagesWidth > 0.5 && scrollPosX/pagesWidth <= 1.5) {
//     	menuChar = "agenda";
//     } else if(scrollPosX/pagesWidth > 1.5 && scrollPosX/pagesWidth <= 2.5) {
//     	menuChar = "tram";
//     }
//     $('#menu').html(menuChar);
// }); 
// /MENU ----------------------------------------------------------------------------------
// MENSA ----------------------------------------------------------------------------------

$('#mensaLoadingImg').velocity({ rotateZ: "360deg"}, {loop: true});

$.get('http://www.corsproxy.com/zfv.ch/de/microsites/gastronomie-im-toni-areal/menueplan', function(response) {
    var $mensaData = $(response);

    $('#mensaLoading').toggle(false);

    if(today.getDay() == 6) {
        today = new Date(moment().valueOf() +86400000*2);
    }
    if(today.getDay() == 0) {
        today = new Date(moment().valueOf() + 86400000);
    }

    drawMensaMenu($mensaData, today);
});

var drawMensaMenu = function($mensaData, mensaDate) {

    var weekOfYearMensa = mensaDate.getWeek();
    var dayOfWeekMensa = mensaDate.getDay();

    var mensaHeight = -5*bodyEm;
    $('#mensa div').each(function() {
        mensaHeight = mensaHeight + $(this).height() + 1.44*bodyEm;
    })

    $('<div>', {
        id: 'mensaTileDate' + dayOfWeekMensa,
        class: 'mensaTileDate roboto',
        html: moment(mensaDate).format("dddd, Do MMM YYYY")
    }).appendTo('#mensa');

    if(moment(mensaDate).format("YYYY-MM-D") == now.format("YYYY-MM-D")) {
        $('#mensaTileDate' + dayOfWeekMensa).html(moment(mensaDate).format("[Heute,] Do MMM YYYY"))
    }
    if(moment(mensaDate).format("YYYY-MM-D") == tomorrow.format("YYYY-MM-D")) {
        $('#mensaTileDate' + dayOfWeekMensa).html(moment(mensaDate).format("[Morgen,] Do MMM YYYY"))
    }

    $mensaData.find('tbody tr').each(function(indexMensa) {
        if($(this).data('dayofweek') == dayOfWeekMensa && $(this).data('weeknumber') == weekOfYearMensa) {

            var mensaMenuArt = $(this).find(':nth-child(1)');
            var mensaMenu = $(this).find(':nth-child(2)');

            $('<div>', {
                id: 'mensaTile' + indexMensa,
                class: 'mensaTile'
            }).appendTo('#mensa');
            $('<span>', {
                html: mensaMenuArt
            }).appendTo('#mensaTile' + indexMensa);
            $('<p>', {
                html: mensaMenu
            }).appendTo('#mensaTile' + indexMensa);

            $('#mensaMenu').toggle(true);
            $('#mensaMenu tr').toggle(true);
            $('#mensaTile' + indexMensa + ' p br:last-child').remove();
        }   
    });

    if(mensaDate.getDay() != 5) {
        $('<div>', {
            id: 'mensaTileDate' + dayOfWeekMensa + 1,
            class: 'mensaTile next',
            html: 'nächster Tag'
        }).appendTo('#mensa')
    }

    $mensa.animate({
        scrollTop: mensaHeight
    }, 600);

    animationDelayMensa = 0;
    $('.mensaTile').each(function() {
        if(!$(this).is(":visible")) {
            animationDelayMensa++;
            $(this).delay(animationDelayMensa * 100).velocity("transition.flipYIn", 200);
        }
    });

    // recursive function
    $('#mensaTileDate' + dayOfWeekMensa + 1).click(function(){
        $('#mensaTileDate' + dayOfWeekMensa + 1).remove();
        drawMensaMenu($mensaData, new Date(moment(mensaDate).valueOf() + 86400000));
    })
};

// /MENSA ---------------------------------------------------------------------------------
// AGENDA ---------------------------------------------------------------------------------

$('#agendaLoadingImg').velocity({ rotateZ: "360deg"}, {loop: true});

var eventsRangeFrom = moment(now).format("YYYY-MM-D");
var eventsRangeTo = moment(now).add(4, 'M').format("YYYY-MM-D");

$.getJSON( "http://www.zhdk.ch/?agenda/feed&mindate=" + eventsRangeFrom + "&maxdate=" + eventsRangeTo + "&format=json", null, function( data ) {
    drawAgenda(data, 0, 24);
    $('#agendaLoading').toggle(false);
});

var drawAgenda = function(data, fromEvent, toEvent) {
    for (indexLoad = fromEvent; indexLoad <= toEvent; ++indexLoad) {

        var eventDateAndTime = getEventDate(data, indexLoad);

        agendaDayIndex = data.events[indexLoad].startdatum*1000;
        var date = new Date(agendaDayIndex);

        if (agendaDayIndex != agendaDayIndexOld && data.events[indexLoad].enddatum == 0) {
            $('<div>', {
                id: 'agendaTileDate' + agendaDayIndex,
                class: 'agendaTile agendaTileDate roboto',
                html: moment(date).format("dddd, Do MMM YYYY")
            }).appendTo('#agenda');

            if(moment(date).format("YYYY-MM-D") == now.format("YYYY-MM-D")) {
                $('#agendaTileDate' + agendaDayIndex).html(moment(date).format("[Heute,] Do MMM YYYY"));
            }
            if(moment(date).format("YYYY-MM-D") == tomorrow.format("YYYY-MM-D")) {
                $('#agendaTileDate' + agendaDayIndex).html(moment(date).format("[Morgen,] Do MMM YYYY"));
            }
        };

        agendaDayIndexOld = agendaDayIndex;

        $('<div>', {
            id: 'agendaTile' + indexLoad,
            class: "agendaTile"
        }).appendTo('#agenda')
        .click(function(e) {
            $('#popupEvent').toggleClass("popup");
            $('#popupBg').velocity("fadeIn", { duration: 400 });

            var targetNr = e.currentTarget.id.replace('agendaTile', '');

            $('<span>', {
                html: data.events[targetNr].titel
            }).appendTo('#eventContainer');

            $('<span>', {
                html: getEventDateDetail(data, targetNr)
            }).appendTo('#eventContainer');

            $('<span>', {
                html: 'Veranstaltungsort: ' + data.events[targetNr].loc_shortname
            }).appendTo('#eventContainer');
            $('<p>', {
                html: data.events[targetNr].beschreibung
            }).appendTo('#eventContainer');

            //img as background
            $('#popupEvent').css('background-image', 'none');
            if(data.events[targetNr].files_info_img != undefined) {
                if(data.events[targetNr].files_info_img[0].thumb_ext_url != undefined) {
                    var imgURL = data.events[targetNr].files_info_img[0].thumb_ext_url;
                    $('#popupEvent').css({
                        'background-image': 'url(' + imgURL + ')',
                        'background-size': 'auto ' + pagesWidth*2
                    });
                    var imgURLBig = data.events[targetNr].files_info_img[0].img_ext_url;
                    $('<img>', {
                        id: "eventImgLoader"
                    }).appendTo('#eventContainer');
                    $('#eventImgLoader').queue(function(next) { $(this).delay(400)}).attr('src', imgURLBig).load(function() {
                       $(this).remove(); // prevent memory leaks as @benweet suggested
                       $('#popupEvent').css('background-image', 'url(' + imgURLBig + ')');
                    });
                }
            }
        });

        eventDateAndTime = getEventDate(data, indexLoad);

        $('<span>', {
            html: data.events[indexLoad].titel
        }).appendTo('#agendaTile' + indexLoad);
        $('<p>', {
            html: data.events[indexLoad].kurzbeschreibung
        }).appendTo('#agendaTile' + indexLoad);
        $('<span>', {
            html: eventDateAndTime,
            class: 'eventDateAndTime'
        }).appendTo('#agendaTile' + indexLoad);

    }

    $('<div>', {
        class: "agendaTileLoadMore agendaTile",
        html: "Lade weitere"
    }).appendTo('#agenda')
        .click(function(e) {
        drawAgenda(data, toEvent+1, toEvent+25);
        $('.agendaTileLoadMore').toggle(false);
    });

    animationDelayAgenda = 0;
    $('.agendaTile').each(function() {
        if(!$(this).is(":visible") && !$(this).hasClass('eventOverTime')) {
            animationDelayAgenda++;
            $(this).delay(animationDelayAgenda * 100).velocity("transition.flipYIn", 200);
        }
    });
}

function getEventDate(data, index) {
    var dateAndTime;
    if(data.events[index].enddatum != 0) {
        $('#agendaTile' + index).addClass('eventOverTime');
        dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + " - " + moment(data.events[index].enddatum*1000).format("Do MMM YYYY");
    } else {
        if(data.events[index].endzeit != 0) {
        dateAndTime = moment(data.events[index].startzeit*1000).format("HH:mm") + " - " + moment(data.events[index].endzeit*1000).format("HH:mm") + " Uhr";
        } else {
            dateAndTime = moment(data.events[index].startzeit*1000).format("HH:mm") + " Uhr";
        }
    }
    return dateAndTime;   
}
function getEventDateDetail(data, index) {
    var dateAndTime;
    if(data.events[index].enddatum != 0) {
        $('#agendaTile' + index).addClass('eventOverTime');
        dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + " - " + moment(data.events[index].enddatum*1000).format("Do MMM YYYY");
    } else {
        if(data.events[index].endzeit != 0) {
        dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + ", " + moment(data.events[index].startzeit*1000).format("HH:mm") + " - " + moment(data.events[index].endzeit*1000).format("HH:mm") + " Uhr";
        } else {
            dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + ", " + moment(data.events[index].startzeit*1000).format("HH:mm") + " Uhr";
        }
    }
    return dateAndTime;   
}
// /AGENDA --------------------------------------------------------------------------------
// TRAM -----------------------------------------------------------------------------------

$('#tramLoadingImg0').velocity({ rotateZ: "360deg"}, {loop: true});
$('#tramLoadingImg1').velocity({ rotateZ: "360deg"}, {loop: true});
$('#tramLoadingImg2').velocity({ rotateZ: "360deg"}, {loop: true});
$('#tramLoadingImg3').velocity({ rotateZ: "360deg"}, {loop: true});

$.get('http://transport.opendata.ch/v1/connections?from=008591398&to=008503001', function(response) {
    tramToAlt($(response));
    $('#tramLoading0').toggle(false);
});
$.get('http://transport.opendata.ch/v1/connections?from=008591398&to=008576182', function(response) {
    tramToTief($(response));
    $('#tramLoading1').toggle(false);
});
$.get('http://transport.opendata.ch/v1/connections?from=008591135&to=008591428', function(response) {
    tramToWerd($(response));
    $('#tramLoading2').toggle(false);
});
$.get('http://transport.opendata.ch/v1/connections?from=008591135&to=008580522', function(response) {
    tramToEsch($(response));
    $('#tramLoading3').toggle(false);
});
        


var tramToAlt = function(tramToAlt) {

    $.each(tramToAlt.get(0).connections, function(index) {
        var date = new Date(tramToAlt.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToAlt.get(0).connections[index].products[0];

        $('#toAltstetten' + index + ' td:nth-child(2)').html(tramType);
        $('#toAltstetten' + index + ' td:nth-child(3)').html('4');
        $('#toAltstetten' + index + ' td:nth-child(1)').html(departure);
        $('#toAltstettenTile tr').css({'border-bottom': '1px solid #d4d4cc'});
    });
}

var tramToTief = function(tramToTief) {

    $.each(tramToTief.get(0).connections, function(index) {
        var date = new Date(tramToTief.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToTief.get(0).connections[index].products[0];

        $('#toTiefenbrunnen' + index + ' td:nth-child(2)').html(tramType);
        $('#toTiefenbrunnen' + index + ' td:nth-child(3)').html('4');
        $('#toTiefenbrunnen' + index + ' td:nth-child(1)').html(departure);
        $('#toTiefenbrunnenTile tr').css({'border-bottom': '1px solid #d4d4cc'});
    });
}

var tramToWerd = function(tramToWerd) {

    $.each(tramToWerd.get(0).connections, function(index) {
        var date = new Date(tramToWerd.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToWerd.get(0).connections[index].products[0];

        $('#toWerdhoelzli' + index + ' td:nth-child(2)').html(tramType);
        $('#toWerdhoelzli' + index + ' td:nth-child(3)').html('17');
        $('#toWerdhoelzli' + index + ' td:nth-child(1)').html(departure);
        $('#toWerdhoelzliTile tr').css({'border-bottom': '1px solid #d4d4cc'});
    });
}

var tramToEsch = function(tramToEsch) {

    $.each(tramToEsch.get(0).connections, function(index) {
        var date = new Date(tramToEsch.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToEsch.get(0).connections[index].products[0];

        $('#toEscherWyssPlatz' + index + ' td:nth-child(2)').html(tramType);
        $('#toEscherWyssPlatz' + index + ' td:nth-child(3)').html('17');
        $('#toEscherWyssPlatz' + index + ' td:nth-child(1)').html(departure);
        $('#toEscherWyssPlatzTile tr').css({'border-bottom': '1px solid #d4d4cc'});
    });
}


// /TRAM ----------------------------------------------------------------------------------
// CLICK FUNCTIONS ------------------------------------------------------------------------
// MENU
var $hamburger = $('#hamburger');
$('#menu').click(function() {
    if($hamburger.hasClass('dropdown')) {
        $hamburger.velocity({ duration: 250, rotateZ: "0deg"});
        $('div.header').velocity({ height: '4em', duration: 250});
    } else {
        $hamburger.velocity({ duration: 250, rotateZ: "180deg"});
        $('div.header').velocity({ height: '14em', duration: 250});
    }
    $hamburger.toggleClass("dropdown");
});
$hamburger.click(function() {
    if($hamburger.hasClass('dropdown')) {
        $hamburger.velocity({ duration: 250, rotateZ: "0deg"});
        $('div.header').velocity({ height: '4em', duration: 250});
    } else {
        $hamburger.velocity({ duration: 250, rotateZ: "180deg"});
        $('div.header').velocity({ height: '14em', duration: 250});
    }
    $hamburger.toggleClass("dropdown");
});
$('#menuMensa').click(function() {
    $('div.header').velocity({ height: '4em', duration: 250});
    $pagesWrapper.animate({
        scrollLeft: 0
    }, 400);
    $menu.html('mensa');
    $hamburger.velocity({ duration: 250, rotateZ: "0deg"});
    $hamburger.toggleClass("dropdown");
});
$('#menuAgenda').click(function() {
    $('div.header').velocity({ height: '4em', duration: 250});
    $pagesWrapper.animate({
        scrollLeft: pagesWidth
    }, 400);
    $menu.html('agenda');
    $hamburger.velocity({ duration: 250, rotateZ: "0deg"});
    $hamburger.toggleClass("dropdown");
});
$('#menuTram').click(function() {
    $('div.header').velocity({ height: '4em', duration: 250});
    $pagesWrapper.animate({
        scrollLeft: pagesWidth*2
    }, 400);
    $menu.html('tram');
    $hamburger.velocity({ duration: 250, rotateZ: "0deg"});
    $hamburger.toggleClass("dropdown");
});

$('#refresh').click(function() {
    location.reload(true);
    $('#refresh').velocity({ rotateZ: "1800deg"}, {duration: 5000});
});

$('#mensaLoadingTile').click(function() {
    location.reload(true);
});

$('#agendaLoadingTile').click(function() {
    location.reload(true);
});

// INFO
$('#info').click(function() {
    $('#popupInfo').toggleClass("popup");
    $('#popupBg').velocity("fadeIn", { duration: 400 });
});
$('#popupInfo').click(function() {
    $('#popupInfo').toggleClass("popup");
    $('#popupBg').velocity("fadeOut", { duration: 400 });
});


// INFO EVENT
$('#popupEvent').click(function() {
    $('#popupEvent').toggleClass("popup");
    $('#popupBg').velocity("fadeOut", { duration: 400 });
    $('#eventContainer').empty();
});

$(window).on("navigate", function (event, data) {
  var direction = data.state.direction;
  if (direction == 'back') {
    if ($('#popupInfo').hasClass("popup")) {
        event.preventDefault();
        $('#popupInfo').toggleClass("popup");
        $('#popupBg').velocity("fadeOut", { duration: 400 });
    }
  }
});

// /click functions -----------------------------------------------------------------------



});
// Debounce function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};