$(document).ready(function() {



var mySwiper = $('.swiper-container').swiper({
    //Your options here:
    mode:'horizontal',
    loop: false
    //etc..
});

var $body = $('body');
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
    $header = $('#header'),
    $menuMensa = $('#menuMensa'),
    $menuAgenda = $('#menuAgenda'),
    $menuTram = $('#menuTram'),
    pagesWidth = $(window).width(),
    touchEnded = false,
    pullEnded = false,
    animationDelayMensa = 0,
    animationDelayAgenda = 0,
    agendaDayIndex = 0,
    agendaDayIndexOld = 0,
    eventTimeFromTo = null,
    lastEventDate = now;

// $(window).on("orientationchange", function(event) {
//     location.reload();
// });

$.ajaxSetup({ timeout: 5000 });

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};

moment.locale("de");
var months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
var dayOfWeek = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

// MENU -----------------------------------------------------------------------------------
mySwiper.wrapperTransitionEnd(function () {
    if(mySwiper.activeIndex == 0) {
    	menuChar = "mensa";
        $header.addClass('mensa');
        $header.removeClass('agenda');
        $header.removeClass('tram');
        $menuMensa.toggle(false);
        $menuAgenda.toggle(true);
        $menuTram.toggle(true);
    } else if(mySwiper.activeIndex == 1) {
    	menuChar = "agenda";
        $header.addClass('agenda');
        $header.removeClass('mensa');
        $header.removeClass('tram');
        $menuMensa.toggle(true);
        $menuAgenda.toggle(false);
        $menuTram.toggle(true);
    } else if(mySwiper.activeIndex == 2) {
    	menuChar = "tram";
        $header.addClass('tram');
        $header.removeClass('mensa');
        $header.removeClass('agenda');
        $menuMensa.toggle(true);
        $menuAgenda.toggle(true);
        $menuTram.toggle(false);
    }
    $('#menu').html(menuChar);
}, true);

// /MENU ----------------------------------------------------------------------------------
// MENSA ----------------------------------------------------------------------------------

$('#mensaLoadingImg').velocity({ rotateZ: "360deg"}, {loop: true});

var mensaloadCount = 0;
var getMensaData = function() {
    $.ajax({
        url: 'http://www.corsproxy.com/zfv.ch/de/microsites/gastronomie-im-toni-areal/menueplan',
        success: function(response) {
            var $mensaData = $(response);

            $('#mensaLoading img').velocity("stop");
            $('#mensaLoading').toggle(false);

            if(today.getDay() == 6) {
                today = new Date(moment().valueOf() + 86400000*2);
            }
            if(today.getDay() == 0) {
                today = new Date(moment().valueOf() + 86400000);
            }
            drawMensaMenu($mensaData, today);
        },
        error: function() {
            console.log('could not get data');
            if (mensaloadCount < 5) {
                mensaloadCount++;
                getMensaData();
            } else {
                $('#mensaLoading img').velocity("stop");
                $('#mensaLoading').toggle(false);
                $('<div>', {
                    class: 'mensaTileDate roboto',
                    html: 'Daten konnten nicht geladen werden. Es besteht möglicherweise keine Verbindung zum Internet.'
                }).appendTo('#mensa');
            }
        },
        timeout: 4000,
    });
}
getMensaData();

var drawMensaMenu = function($mensaData, mensaDate) {

    var weekOfYearMensa = mensaDate.getWeek();
    var dayOfWeekMensa = mensaDate.getDay();

    var mensaHeight = -5*bodyEm;
    $('#mensa div').each(function() {
        mensaHeight = mensaHeight + $(this).height() + 1.15*bodyEm;
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
            class: 'mensaTile next'
        }).appendTo('#mensa');
        $('<img>', {
            src: 'img/mensaNext.svg',
            class: 'mensaNextIcon'
        }).appendTo('#mensaTileDate' + dayOfWeekMensa + 1);
        // $('<span>', {
        //     class: 'mensaNextSpan',
        //     html: 'nächster Tag'
        // }).appendTo('#mensaTileDate' + dayOfWeekMensa + 1);
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

var agendaloadCount = 0;
var getAgendaData = function() {
    $.getJSON( "http://www.zhdk.ch/?agenda/feed&mindate=" + eventsRangeFrom + "&maxdate=" + eventsRangeTo + "&format=json", null, function( data ) {
        drawAgenda(data, 0, 24);
        $('#agendaLoading img').velocity("stop");
        $('#agendaLoading').toggle(false);
    }).fail(function() {
            if (agendaloadCount < 5) {
            agendaloadCount++;
            getAgendaData();
        } else {
            $('#agendaLoading img').velocity("stop");
            $('#agendaLoading').toggle(false);
            $('<div>', {
                class: 'agendaTileDate roboto',
                html: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.'
            }).appendTo('#agenda');
        }
    });
};
getAgendaData();

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

            agendaDayIndexOld = agendaDayIndex;
        };


        $('<div>', {
            id: 'agendaTile' + indexLoad,
            class: "agendaTile"
        }).appendTo('#agenda')
        .click(function(e) {
            $('#popupEvent').toggleClass("popup");
            $('#popupBg').velocity("fadeIn", { duration: 400 });

            var targetNr = e.currentTarget.id.replace('agendaTile', '');

            $('<span>', {
                html: data.events[targetNr].titel,
                class: 'eventTitleDetail'
            }).appendTo('#eventContainer');

            $('<img>', {
                src: 'img/clock.svg',
                class: 'eventDateIconDetail'
            }).appendTo('#eventContainer');
            $('<span>', {
                html: getEventDateDetail(data, targetNr),
                class: 'eventDateDetail'
            }).appendTo('#eventContainer');

            if(data.events[targetNr].loc_shortname != undefined) {
                $('<img>', {
                    src: 'img/location.svg',
                    class: 'eventLocationIconDetail'
                }).appendTo('#eventContainer');
                $('<span>', {
                    html: data.events[targetNr].loc_shortname,
                    class: 'eventLocationDetail'
                }).appendTo('#eventContainer');
            }

            $('#popupEvent').css('background-image', 'none');
            if(data.events[targetNr].files_info_img != undefined) {
                if(data.events[targetNr].files_info_img[0].thumb_ext_url != undefined) {
                    var imgURL = data.events[targetNr].files_info_img[0].thumb_ext_url;
                    $('<img>', {
                        src: imgURL,
                        id: 'eventImageDetail'
                    }).appendTo('#eventContainer');
                    if(data.events[targetNr].files_info_img[0].img_ext_url != undefined) {
                        $('<img>', {
                            id: "eventImgLoader"
                        }).appendTo('#eventContainer');
                        $('#eventImgLoader').attr('src', data.events[targetNr].files_info_img[0].img_ext_url).load(function() {
                           $(this).remove(); // prevent memory leaks as @benweet suggested
                           $('#eventImageDetail').attr('src', data.events[targetNr].files_info_img[0].img_ext_url);
                        });
                    }
                }
            }

            var eventDescriptionDetail = data.events[targetNr].beschreibung;//$(data.events[targetNr].beschreibung).clone().find("script,noscript,style").remove().end().html();  
            if(data.events[targetNr].beschreibung != undefined) {
                $('<p>', {
                    html: eventDescriptionDetail
                }).appendTo('#eventContainer');
            }
        });

        eventDateAndTime = getEventDate(data, indexLoad);

        $('<span>', {
            html: data.events[indexLoad].titel
        }).appendTo('#agendaTile' + indexLoad);
        $('<p>', {
            html: data.events[indexLoad].kurzbeschreibung,
            id: 'eventBeschreibung' + indexLoad
        }).appendTo('#agendaTile' + indexLoad);
        $('#eventBeschreibung' + indexLoad + ' a').removeAttr("href");

        $('<img>', {
            src: 'img/clock.svg',
            class: 'eventTimeIcon'
        }).appendTo('#agendaTile' + indexLoad);
        $('<span>', {
            html: eventDateAndTime,
            class: 'eventDateAndTime'
        }).appendTo('#agendaTile' + indexLoad);
        if(data.events[indexLoad].loc_shortname != undefined) {
            $('<img>', {
                src: 'img/location.svg',
                class: 'eventLocationIcon'
            }).appendTo('#agendaTile' + indexLoad);
            $('<span>', {
                html: data.events[indexLoad].loc_shortname,
                class: 'eventLocation'
            }).appendTo('#agendaTile' + indexLoad);
        } else {
            $('<span>', {
                html: "",
                class: 'eventLocation'
            }).appendTo('#agendaTile' + indexLoad);
        }

        lastEventDate = moment(data.events[indexLoad].startdatum*1000);
    }

    if(lastEventDate.format('X') <= moment(now).add(3, 'M').format('X')) {
        $('<div>', {
            id: 'agendaTileLoadMore' + indexLoad,
            class: "agendaTileLoadMore agendaTile"
        }).appendTo('#agenda')
            .click(function(e) {
            drawAgenda(data, toEvent+1, toEvent+25);
            $('.agendaTileLoadMore').toggle(false);
        });
        $('<img>', {
            src: 'img/agendaNext.svg',
            class: 'agendaNextIcon'
        }).appendTo('#agendaTileLoadMore' + indexLoad);
        // $('<span>', {
        //     class: 'agendaLoadMore',
        //     html: 'lade weitere'
        // }).appendTo('#agendaTileLoadMore' + indexLoad);
    };

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
        dateAndTime = moment(data.events[index].startzeit*1000).format("HH:mm") + " - " + moment(data.events[index].endzeit*1000).format("HH:mm");
        } else {
            dateAndTime = moment(data.events[index].startzeit*1000).format("HH:mm");
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
        dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + ", " + moment(data.events[index].startzeit*1000).format("HH:mm") + " - " + moment(data.events[index].endzeit*1000).format("HH:mm");
        } else {
            dateAndTime = moment(data.events[index].startdatum*1000).format("Do MMM YYYY") + ", " + moment(data.events[index].startzeit*1000).format("HH:mm");
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

var tramloadCount0 = 0;
var getTram0Data = function() {
    $.get('http://transport.opendata.ch/v1/connections?from=008591398&to=008591374', function(response) {
        tramToAlt($(response));
        $('#tramLoading0 img').velocity("stop");
        $('#tramLoading0').toggle(false);
    }).fail(function() {
        if (tramloadCount0 < 5) {
            tramloadCount0++;
            getTram0Data();
        } else {
            $('#tramLoading0 img').velocity("stop");
            $('#tramLoading0').toggle(false);
            $('<p>', {
                html: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.'
            }).appendTo('#toAltstettenTile');
        }
    });
};
getTram0Data();

var tramloadCount1 = 0;
var getTram1Data = function() {
    $.get('http://transport.opendata.ch/v1/connections?from=008591398&to=008580522', function(response) {
        tramToTief($(response));
        $('#tramLoading1 img').velocity("stop");
        $('#tramLoading1').toggle(false);
    }).fail(function() {
        if (tramloadCount1 < 5) {
            tramloadCount1++;
            getTram1Data();
        } else {
            $('#tramLoading1 img').velocity("stop");
            $('#tramLoading1').toggle(false);
            $('<p>', {
                html: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.'
            }).appendTo('#toTiefenbrunnenTile');
        }
    });
};
getTram1Data();

var tramloadCount2 = 0;
var getTram2Data = function() {
    $.get('http://transport.opendata.ch/v1/connections?from=008591135&to=008591131', function(response) {
        tramToWerd($(response));
        $('#tramLoading2 img').velocity("stop");
        $('#tramLoading2').toggle(false);
    }).fail(function() {
        if (tramloadCount2 < 5) {
            tramloadCount2++;
            getTram2Data();
        } else {
            $('#tramLoading2 img').velocity("stop");
            $('#tramLoading2').toggle(false);
            $('<p>', {
                html: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.'
            }).appendTo('#toWerdhoelzliTile');
        }
    });
};
getTram2Data();

var tramloadCount3 = 0;
var getTram3Data = function() {
    $.get('http://transport.opendata.ch/v1/connections?from=008591135&to=008580522', function(response) {
        tramToEsch($(response));
        $('#tramLoading3 img').velocity("stop");
        $('#tramLoading3').toggle(false);
    }).fail(function() {
        if (tramloadCount3 < 5) {
            tramloadCount3++;
            getTram3Data();
        } else {
            $('#tramLoading3 img').velocity("stop");
            $('#tramLoading3').toggle(false);
            $('<p>', {
                html: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.'
            }).appendTo('#toEscherWyssPlatzTile');
        }
    });
};
getTram3Data();
        


var tramToAlt = function(tramToAlt) {

    $.each(tramToAlt.get(0).connections, function(index) {
        var date = new Date(tramToAlt.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToAlt.get(0).connections[index].products[0];

        if(tramType == 'NFT') {
            $('<img>', {
                src: 'img/NFT.svg',
                class: 'NFT'
            }).appendTo('#toAltstetten' + index + ' td:last-child');
        }
        $('#toAltstetten' + index + ' td:nth-child(2)').html('4');
        $('#toAltstetten' + index + ' td:nth-child(1)').html(departure);
        $('#toAltstettenTile tr').css({'border-top': '1px solid #b4b4af'});
    });
}

var tramToTief = function(tramToTief) {

    $.each(tramToTief.get(0).connections, function(index) {
        var date = new Date(tramToTief.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToTief.get(0).connections[index].products[0];

        if(tramType == 'NFT') {
            $('<img>', {
                src: 'img/NFT.svg',
                class: 'NFT'
            }).appendTo('#toTiefenbrunnen' + index + ' td:last-child');
        }
        $('#toTiefenbrunnen' + index + ' td:nth-child(2)').html('4');
        $('#toTiefenbrunnen' + index + ' td:nth-child(1)').html(departure);
        $('#toTiefenbrunnenTile tr').css({'border-top': '1px solid #b4b4af'});
    });
}

var tramToWerd = function(tramToWerd) {

    $.each(tramToWerd.get(0).connections, function(index) {
        var date = new Date(tramToWerd.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToWerd.get(0).connections[index].products[0];

        if(tramType == 'NFT') {
            $('<img>', {
                src: 'img/NFT.svg',
                class: 'NFT'
            }).appendTo('#toWerdhoelzli' + index + ' td:last-child');
        }
        $('#toWerdhoelzli' + index + ' td:nth-child(2)').html('17');
        $('#toWerdhoelzli' + index + ' td:nth-child(1)').html(departure);
        $('#toWerdhoelzliTile tr').css({'border-top': '1px solid #b4b4af'});
    });
}

var tramToEsch = function(tramToEsch) {

    $.each(tramToEsch.get(0).connections, function(index) {
        var date = new Date(tramToEsch.get(0).connections[index].from.departureTimestamp*1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var departure = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);

        var tramType = tramToEsch.get(0).connections[index].products[0];

        if(tramType == 'NFT') {
            $('<img>', {
                src: 'img/NFT.svg',
                class: 'NFT'
            }).appendTo('#toEscherWyssPlatz' + index + ' td:last-child');
        }
        $('#toEscherWyssPlatz' + index + ' td:nth-child(2)').html('17');
        $('#toEscherWyssPlatz' + index + ' td:nth-child(1)').html(departure);
        $('#toEscherWyssPlatzTile tr').css({'border-top': '1px solid #b4b4af'});
    });
}


// /TRAM ----------------------------------------------------------------------------------
// CLICK FUNCTIONS ------------------------------------------------------------------------
// MENU
var $hamburger = $('#hamburger');
$('#menu').click(function() {
    if($hamburger.hasClass('dropdown')) {
        $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
        $('div#header').velocity({ height: '4em'}, {duration: 300});
        $('#headerBg').velocity("fadeOut", { duration: 300 });

        // $('#info').delay(150).fadeIn(150);
        // $('#refresh').delay(150).fadeIn(150);
        // $('#toToniApps').fadeOut(150);
    } else {
        $hamburger.velocity({rotateZ: "180deg"}, {duration: 300});
        $('div#header').velocity({ height: '11em'}, {duration: 300});
        $('#headerBg').velocity("fadeIn", { duration: 300 });

        // $('#info').fadeOut(150);
        // $('#refresh').fadeOut(150);
        // $('#toToniApps').delay(150).fadeIn(150);
    }
    $hamburger.toggleClass("dropdown");
});
$hamburger.click(function() {
    if($hamburger.hasClass('dropdown')) {
        $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
        $('div#header').velocity({ height: '4em'}, {duration: 300});
        $('#headerBg').velocity("fadeOut", { duration: 300 });

        // $('#info').delay(150).fadeIn(150);
        // $('#refresh').delay(150).fadeIn(150);
        // $('#toToniApps').fadeOut(150);
    } else {
        $hamburger.velocity({rotateZ: "180deg"}, {duration: 300});
        $('div#header').velocity({ height: '11em'}, {duration: 300});
        $('#headerBg').velocity("fadeIn", { duration: 300 });

        // $('#info').fadeOut(150);
        // $('#refresh').fadeOut(150);
        // $('#toToniApps').delay(150).fadeIn(150);
    }
    $hamburger.toggleClass("dropdown");
});
$('#menuMensa').click(function() {
    $('div#header').velocity({ height: '4em'}, {duration: 300});
    mySwiper.swipeTo(0, 400);
    $menu.html('mensa');
    $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
    $hamburger.toggleClass("dropdown");
    $('#headerBg').velocity("fadeOut", { duration: 300 });

    // $('#info').delay(400).fadeIn(150);
    // $('#refresh').delay(400).fadeIn(150);
    // $('#toToniApps').fadeOut(400);
});
$('#menuAgenda').click(function() {
    $('div#header').velocity({ height: '4em'}, {duration: 300});
    mySwiper.swipeTo(1, 400);
    $menu.html('agenda');
    $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
    $hamburger.toggleClass("dropdown");
    $('#headerBg').velocity("fadeOut", { duration: 300 });

    // $('#info').delay(400).fadeIn(150);
    // $('#refresh').delay(400).fadeIn(150);
    // $('#toToniApps').fadeOut(400);
});
$('#menuTram').click(function() {
    $('div#header').velocity({ height: '4em'}, {duration: 300});
    mySwiper.swipeTo(2, 400);
    $menu.html('tram');
    $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
    $hamburger.toggleClass("dropdown");
    $('#headerBg').velocity("fadeOut", { duration: 300 });

    // $('#info').delay(400).fadeIn(150);
    // $('#refresh').delay(400).fadeIn(150);
    // $('#toToniApps').fadeOut(400);
});
$('#headerBg').click(function() {
    $('div#header').velocity({ height: '4em'}, {duration: 300});
    $hamburger.velocity({rotateZ: "0deg"}, {duration: 300});
    $hamburger.toggleClass("dropdown");
    $('#headerBg').velocity("fadeOut", { duration: 300 });
});

$('#refresh').click(function() {
    document.location.reload(true);
    $('#refresh').velocity({rotateZ: "1800deg"}, {duration: 5000}, {loop: true});
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

// $("#toToniApps").click(function(){
//     window.location.href="../../";
// });

// /click functions -----------------------------------------------------------------------

});

/*
----Important swipe commands---
mySwiper.activeSlide() - returns the currently active slide (slide instance, HTMLElement)

*/

// OLD SNAPPING CRAP ---------------------------------------------------------------------
// var touchMoveFunction = debounce( function(e) {
//     touchMove.x = e.originalEvent.changedTouches[0].clientX;
//     touchMove.y = e.originalEvent.changedTouches[0].clientY;

//     if(Math.abs(touchMove.x - touchStart.x) > 10 && Math.abs(touchMove.y - touchStart.y) < 100) {
//         $pagesWrapper.animate({
//             scrollLeft: scrollPosX + touchStart.x - touchMove.x
//         }, 0);
//     }
// },16)
/*
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
*/

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



// var snapPages = function() {
//     scrollPosX = $pagesWrapper.scrollLeft();
//     if(scrollPosX/pagesWidth <= 0.5) {
//         $pagesWrapper.animate({
//             scrollLeft: 0
//         }, 140);
//         menuLabel = "mensa";
//     } else if(scrollPosX/pagesWidth > 0.5 && scrollPosX/pagesWidth <= 1.5) {
//         $pagesWrapper.animate({
//             scrollLeft: pagesWidth
//         }, 140);
//         menuLabel = "agenda";
//     } else if(scrollPosX/pagesWidth > 1.5 && scrollPosX/pagesWidth <= 2.5) {
//         $pagesWrapper.animate({
//             scrollLeft: pagesWidth*2
//         }, 140);
//         menuLabel = "tram";
//     }
//     $menu.html(menuLabel);
// };

// Debounce function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// function debounce(func, wait, immediate) {
//     var timeout;
//     return function() {
//         var context = this, args = arguments;
//         var later = function() {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// };
// /OLD SNAPPING CRAP --------------------------------------------------------------------