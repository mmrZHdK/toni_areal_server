// Globale Variablen

var myDatabase = new Firebase("https://toni-ferner.firebaseio.com/");
var currentArticleKey;
var userFavArray = [];
var codes = [   "456",
                "123",
                "789",
                "159",
                "753",
                "258",
                "159"
            ];

var userID;

// keypad input validieren & artikel aufbauen
function validateInput(obj) {
    var inputValues = $("#keypadInput").text();
    if(inputValues.length >= 3) {
        if($.inArray(inputValues, codes) != -1) {
            Finch.navigate("article/"+inputValues);
            $("#keypadInput").text("");
        }
        else {
            $("#keypadInput").text("");
        }
    }
}

// URL holen
function showArticle(inputKey) {
    myDatabase.once("value", function (snapshot) {
        queryArticle(snapshot.val().articles[inputKey], inputKey);
    });
    currentArticleKey = inputKey;
}

// Artikel von Server holen
function queryArticle(filename, inputKey) {
    var key = inputKey;
    $.ajax({
        type: "GET",
        url: "content/" + filename,
        dataType: "json",
        success: pipi,
        error: error
    });

    function pipi(data) {
        displayArticle(data, key);
    }
}

// Artikel aufbauen
function displayArticle(data, key) {
    $content = $("#content");

    $content.html("");
    var $context = $("<p></p>").attr("class", "context").text(data.context);
    var $divider1 = $("<p>&#x25AC</p>").attr("id", "divider1");
    var $divider2 = $("<p>&#x25AC</p>").attr("id", "divider2");
    var $title = $("<p></p>").attr("class", "title").text(data.title);
    $content.append($context).append($divider1).append($title).append($divider2);

    // image owl
    $owl = $("<div></div>").attr({"id": "articleOwl", "class":"owl-carousel owl-theme"});
    $.each(data.media.src, function(index, item) {
        $tempEl = $("<div></div>").attr("class", "item").append($("<img src='" + item + "'>"));
        $owl.append($tempEl);
    });

    $content.append($owl);

    $("#articleOwl").owlCarousel({

        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        navigation: false
    });

    $.each(data.text, function(index,item) {
        var $text = $("<p></p>").attr("class", "text").text(data.text[index]);
        $content.append($text);
    });

    if(data.link != "") {
        var $linkDiv = $("<div></div>").attr("id", "linkContainer");
        var $link = $("<a></a>").attr({"href": data.link, class: "link"});
        var $linkP = $("<p></p>").attr("id", "linkP").text("LINK ZUR ORIGINALQUELLE");
        $link.append($linkP);
        $linkDiv.append($link);
        $content.append($linkDiv);
    }


    var featureLogos = [
        {"name": "favorites", "text": "ALS FAVORIT HINZUFÜGEN", "url": "logos/favorites.svg" },
        {"name": "share", "text": "BEITRAG TEILEN", "url": "logos/share.svg"},
        {"name": "similar", "text": "ÄHNLICHE BEITRÄGE", "url": "logos/similar-01.svg"}
    ];

    var $featureLogoContainer = $("<div></div>").attr("id", "featureLogoContainer");

    $.each(featureLogos, function(index, item) {
        var $featureLogo = $("<div></div>").attr({"class": "featureLogo", "id": featureLogos[index].name});
        if(item.name == "favorites" && $.inArray(key, userFavArray) != -1) {
            $featureLogo.addClass("favorites-true");
        }
        $featureLogo.append($("<img src='" + featureLogos[index].url + "'>"));
        $featureLogo.append($("<p></p>").text(featureLogos[index].text));
        $featureLogoContainer.append($featureLogo);
        $featureLogo.on("click", function() {
            callFeature(featureLogos[index].name, key);
        });
    });

    $content.append($featureLogoContainer);

}

function callFeature(task, key) {
    if(task == "favorites") {
        if($.inArray(key, userFavArray) == -1) {
            addToFavorites(task, key);
            //mach irgendwas farbig
        }
        else {
            removeFromFavorites(task, key);
        }

    } else if (task == "share") {

    } else if (task == "similar") {

    }
}

function addToFavorites(task, key) {
    var usersRef = myDatabase.child("users").child(userID);
    var id = $.cookie("ToniFerner");
    console.log(usersRef);

    userFavArray.push(key);

    usersRef.set(userFavArray);

    $("#"+task).addClass("favorites-true");
    console.log("Added article " + key + " to Database");
}

function removeFromFavorites(task, key) {
    userFavArray = $.grep(userFavArray, function(e) {
        return e != key;
    });

    console.log("The new Array: " + userFavArray);
    var usersRef = myDatabase.child("users").child(userID);
    var id = $.cookie("ToniFerner");

    usersRef.set(userFavArray);

    $("#"+task).removeClass("favorites-true");
    console.log("Removed article" + key + " from Database");
}


// AJAX error message
function error(papipapo, errorMessage, kaka) {
    console.log(errorMessage);
}

// keypad aufbauen
function buildKeyboard() {
    $("#myKeypad").children().each(function(index, item) {
        var $key = $(item);
        var $keyData = $key.data("key");
        $p = $("<p>" + $keyData + "</p>").addClass("keyTag");
        $key.append($p);

        $key.on("touchend", function() {
            var keyPadInputText = $("#keypadInput").text();
            if($keyData == "delete") {
                keyPadInputText = keyPadInputText.slice(0, -1);
                $("#keypadInput").text(keyPadInputText);
            }
            else if($keyData != "delete" && $keyData != "empty" ) {
                $("#keypadInput").text(keyPadInputText + $keyData);
                validateInput();
            }
        });
    });

    //Define Image Background
    $.get("./content/keypadImages.json", setBackground);

    function setBackground(data) {
        $("#keypadBackground").attr("src",data.image1)
    }

    // Remove border Header
    $(".header").css("border-bottom", "1px solid grey")
}


//sachen

var currentScreens = new Array(3);
var lastScreen, lastScreenType, lastArticle;

var screenToLogoUrl = {
    "menu": "logos/burger.svg",
    "keypad": "logos/keypad.svg",
    "back": "logos/arrow_left.svg",
    "cross": "logos/cross.svg"
}

var mainScreens = ["article", "list", "keypad"];


function setView(screenType, inDir,  url) {
    currentScreens[1] = screenType;

    $.each(mainScreens, hideAndPark);

    $("." + screenType).css("left", "0");
    $("." + screenType).show();

    if(lastScreen == "menu") {
        $(".header").css("left", "0");
        $("." + lastScreenType).css("left", "0%");
        $(".menu").css("left", "-80%");
    } else if(screenType == "menu") {
        $(".header").css("left", "80%");
        $("." + lastScreenType).css("left", "80%").show();
    }

    // Tracking of Last Screen
    if(url != undefined) {
        lastScreen = url;
        lastArticle = url;
        lastScreenType = screenType;
    } else {
        lastScreen = screenType;
        lastScreenType = screenType;
    }
}

function setButtonControls(leftButton, rightButton) {
    var herbert = lastScreen;
    var vreni = lastArticle;
    $leftButton = $("#leftButton");
    $rightButton = $("#rightButton");

    $leftButton.off();
    $rightButton.off();


    if(rightButton == "back") {
       $rightButton.on("click", function() {
           if(herbert == "menu")
            goTo(vreni);
           else
            goTo(herbert);
        });
    } else {
        $rightButton.on("click", function() {
            goTo(rightButton);
        });
    }

    if(leftButton == "back") {
        $leftButton.on("click", function() {
            goTo(herbert);
        });
    } else {
        $leftButton.on("click", function() {
            goTo(leftButton);
        });
    }
}

function setButtonViews(leftButton, rightButton) {
    $leftButton = $("#leftButton");
    $rightButton = $("#rightButton");

    if(rightButton != "") {
        $rightButton.html("");
        $rightButton.append("<img src='" + screenToLogoUrl[rightButton] + "'></a>");
    }

    if(leftButton != "") {
        $leftButton.html("");
        $leftButton.append("<img src='" + screenToLogoUrl[leftButton] + "'></a>");
    }
}

function prepareNeighborViews(leftScreen, rightScreen) {
    $leftScreen = $("#"+leftScreen);
    $rightScreen = $("#"+rightScreen);

    if(leftScreen == "menu") {
        $leftScreen.css("left", "-80%");
    }
    else {
        leftScreen.css("left", "-100%");
    }

    $("#" + rightScreen).css("left", "100%");
    $leftScreen.show();
    $rightScreen.show();
}

function hideAndPark(index, item) {
    $("." + item).hide();
    $("." + item).css("left", "200%");
}

function goTo(screenType) {
    if(screenType == "back") {
        Finch.navigate(lastScreen);
    } else {
        Finch.navigate(screenType, true);
    }
}

function showList() {
    $(".list").html("");

    var $list = $("<ul></ul>").attr("id", "article-list");
    var myUrl, myIndex, myKeyArray;

    myDatabase.once("value", function (snapshot) {
        buildList(snapshot.val().articles);
    });

    function buildList(articles) {
        $.each(articles, getArticle)
    }

    function getArticle(index, item) {
        myUrl = item;
        myIndex = index;
        $.ajax({
            type: "GET",
            url: "content/" + item,
            dataType: "json",
            success: displayInList,
            error: error
        });

        function displayInList(data) {
            var $li = $("<li></li>").html("<a href=" + "#article/" + index + "/true" + "><div class='article-list-item'><div class='article-logo'><img src='" + data.media.src[0] + "'></div><div class='article-text'><p>" + data.context + " </p><p>" + data.title + "</p></div><div class='article-nav'><img src='logos/arrow_right.svg'></div></div></a>");

            appendToList($li);
        }
    }

    function appendToList(item) {
        $($list).append(item);
    }



    $(".list").append($list);
}

function showFavList() {
    $(".list").html("");

    var $list = $("<ul></ul>").attr("id", "article-list");
    var myUrl, myIndex, myKeyArray;

    myDatabase.once("value", function (snapshot) {
        buildList(snapshot.val().users[userID]);
    });

    function buildList(articleIds) {
        $.each(articleIds, function(i, item) {
            myDatabase.once("value", function (snapshot) {
                getArticle(item, snapshot.val().articles[item]);
            });
        });
    }

    function getArticle(index, item) {
        myUrl = item;
        myIndex = index;
        $.ajax({
            type: "GET",
            url: "content/" + item,
            dataType: "json",
            success: displayInList,
            error: error
        });

        function displayInList(data) {
            var $li = $("<li></li>").html("<a href=" + "#article/" + index + "/true" + "><div class='article-list-item'><div class='article-logo'><img src='" + data.media.src[0] + "'></div><div class='article-text'><p>" + data.context + " </p><p>" + data.title + "</p></div><div class='article-nav'><img src='logos/arrow_right.svg'></div></div></a>");

            appendToList($li);
        }
    }

    function appendToList(item) {
        $($list).append(item);
    }



    $(".list").append($list);
}

$(document).ready(function() {

    Finch.route("/article/:articleId/:direction", function(bindings) {
        showArticle(bindings.articleId);

        url = "/article/" + bindings.articleId;
        backToList = bindings.direction;
        if(backToList == "true") {
            setButtonControls("back", "keypad");
            setButtonViews("back", "keypad");
        }
        else {
            setButtonControls("menu", "keypad");
            setButtonViews("menu", "keypad")
        }
        setView("article", "", url);
    });

    Finch.route("/menu", function() {
        setButtonControls("back", "");
        setButtonViews("menu", "");
        setView("menu");

    });

    Finch.route("/keypad/:direction", function(bindings) {
        setButtonControls("menu", "back");
        setButtonViews("menu", "cross");
        setView("keypad", bindings.direction);
    });

    Finch.route("/", function(bindings) {
        setButtonControls("menu", "back");
        setButtonViews("menu", "cross");
        setView("keypad", bindings.direction);
    });

    Finch.route("/list/:listType", function(bindings) {
        if(bindings.listType == "all") {
            showList();
        } else if (bindings.listType == "favorites") {
            showFavList();
        }
        setButtonControls("menu", "keypad");
        setButtonViews("menu", "keypad");
        url = "/list/" + bindings.listType;
        setView("list", "", url);

    });



    Finch.listen();



    buildKeyboard();

    var date = new Date();
    var id = date.getTime();

    if($.cookie("ToniFerner") == undefined) {
        $.cookie("ToniFerner", id, { expires: 365, path: '/' });
    }

    userID = $.cookie("ToniFerner");

    myDatabase.once("value", function (snapshot) {
        userFavArray = [];
        if (snapshot.val().users == undefined) {
            var myObj = {};
            myObj[$.cookie("ToniFerner")] = [999999];
            myDatabase.child("users").set(myObj);

        }

        console.log(userID);
        console.log(snapshot.val().users[userID][0]);

        $.each(snapshot.val().users[userID], function(index, item) {
            console.log(item);
            userFavArray.push(item);
            });

        console.log(userFavArray);
        });

});




