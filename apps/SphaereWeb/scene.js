var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

SEPARATION = 200,
AMOUNTX = 10,
AMOUNTY = 10,

camPosition = [-50, 100, 0],
camZoom=.07,
zoomFactor=10,

camLeft = window.innerWidth * camZoom,
camTop = window.innerHeight * camZoom,

camera, scene, renderer, controls, group, zvvData, cameraOrtho, sceneOrtho, barGroup, tramMinutes, triangle, redBar, gradient,

scale = 1,
multiTouches = [0,0,0,0,0];
multiTouchId = 0;

touchstart = {x:0,y:0},
rotation = {y:0,z:100},

sunrise = 6,
sunset = 18,

barGroupOffset = 0,

barSpace = 150,

weather = [],

dropPositions = [],
restaurantsObj = [],

mylatesttap = 0,
dropIndex = 0,

rainChance = 0,
snowChance = 0,

launchTime = new Date().getTime(),

objects = {
    ground : undefined,
    toni : [],
    tram1: undefined,
    tram2: undefined,
    time: undefined,
    departures: {
        toniA: [],
        toniB: [],
        fischerwegA: [],
        fischerwegB: []
    },
    tramTA: undefined
},

lastDepartures = {
    toniA: 0,
    toniB: 0
}

stringTime = "",

time = new Date().getTime(),
settingTime = false,
resettingView = false,
connectionAtCurrentTimeT = 0,
connectionAtCurrentTimeF = 0,

lastDateTimed = 0,

isDay = true,
lastIsDay = false,
dayLight = 0,
lastDayLight = 0,
lastTimeInHours = -1,

materialToni = new THREE.MeshBasicMaterial	( {color: new THREE.Color(1,.15,.15)} ),
materialBack = new THREE.MeshBasicMaterial({ color: 0xffffff }),

lightColor = new THREE.Color(.95,.95,.95),
darkColor =  new THREE.Color(.15,.15,.15),
clearColor = new THREE.Color(.15,.15,.15),

weatherCodes = {
    "200": {
        "name": "thunderstorm with light rain",
        "day": [159,166,174],
        "night": [29,35,40],
        "rain": 0.1,
        "snow": 0.0,
        "thunder": 0.0
    },
    "201": {
        "name": "thunderstorm with rain",
        "day": [124,135,142],
        "night": [33,35,36],
        "rain": 0.4,
        "snow": 0.0,
        "thunder": 0.0
    },
    "202": {
        "name": "thunderstorm with heavy rain",
        "day": [105,115,124],
        "night": [28,28,29],
        "rain": 0.8,
        "snow": 0.0,
        "thunder": 0.0
    },
    "210": {
        "name": "light thunderstorm",
        "day": [188,188,186],
        "night": [31,32,49],
        "rain": 0.2,
        "snow": 0.0,
        "thunder": 0.0
    },
    "211": {
        "name": "thunderstorm",
        "day": [150,152,156],
        "night": [32,32,45],
        "rain": 0.4,
        "snow": 0.0,
        "thunder": 0.0
    },
    "212": {
        "name": "heavy thunderstorm",
        "day": [103,113,123],
        "night": [34,34,44],
        "rain": 0.6,
        "snow": 0.0,
        "thunder": 0.0
    },
    "221": {
        "name": "ragged thunderstorm",
        "day": [84,99,112],
        "night": [26,26,29],
        "rain": 0.8,
        "snow": 0.0,
        "thunder": 0.0
    },
    "230": {
        "name": "thunderstorm with light drizzle",
        "day": [185,185,185],
        "night": [44,42,42],
        "rain": 0.05,
        "snow": 0.0,
        "thunder": 0.0
    },
    "231": {
        "name": "thunderstorm with drizzle",
        "day": [165,165,168],
        "night": [31,29,29],
        "rain": 0.1,
        "snow": 0.0,
        "thunder": 0.0
    },
    "232": {
        "name": "thunderstorm with heavy drizzle",
        "day": [151,155,161],
        "night": [18,17,17],
        "rain": 0.2,
        "snow": 0.0,
        "thunder": 0.0
    },
    
    "300": {
        "name": "light intensity drizzle",
        "day": [247,247,249],
        "night": [22,22,24],
        "rain": 0.05,
        "snow": 0.0,
        "thunder": 0.0
    },
    "301": {
        "name": "drizzle",
        "day": [230,233,232],
        "night": [29,32,31],
        "rain": 0.1,
        "snow": 0.0,
        "thunder": 0.0
    },
    "302": {
        "name": "heavy intensity drizzle",
        "day": [206,217,214],
        "night": [35,40,39],
        "rain": 0.3,
        "snow": 0.0,
        "thunder": 0.0
    },
    "310": {
        "name": "light intensity drizzle rain",
        "day": [244,244,244],
        "night": [28,26,26],
        "rain": 0.1,
        "snow": 0.0,
        "thunder": 0.0
    },
    "311": {
        "name": "drizzle rain",
        "day": [194,206,204],
        "night": [36,39,39],
        "rain": 0.3,
        "snow": 0.0,
        "thunder": 0.0
    },
    "312": {
        "name": "heavy intensity drizzle rain",
        "day": [167,184,181],
        "night": [31,34,33],
        "rain": 0.5,
        "snow": 0.0,
        "thunder": 0.0
    },
    "313": {
        "name": "shower rain and drizzle",
        "day": [198,210,206],
        "night": [38,40,39],
        "rain": 0.7,
        "snow": 0.0,
        "thunder": 0.0
    },
    "314": {
        "name": "heavy shower rain and drizzle",
        "day": [152,175,171],
        "night": [27,29,29],
        "rain": 1,
        "snow": 0.0,
        "thunder": 0.0
    },
    "321": {
        "name": "shower drizzle",
        "day": [155,173,191],
        "night": [25,27,29],
        "rain": 0.6,
        "snow": 0.0,
        "thunder": 0.0
    },
    "500": {
        "name": "light rain",
        "day": [211,224,241],
        "night": [17,18,19],
        "rain": 0.25,
        "snow": 0.0,
        "thunder": 0.0
    },
    "501": {
        "name": "moderate rain",
        "day": [187,202,222],
        "night": [22,23,26],
        "rain": 0.4,
        "snow": 0.0,
        "thunder": 0.0
    },
    "502": {
        "name": "heavy intensity rain",
        "day": [164,179,198],
        "night": [28,31,34],
        "rain": 0.6,
        "snow": 0.0,
        "thunder": 0.0
    },
    "503": {
        "name": "very heavy rain",
        "day": [146,158,173],
        "night": [34,37,40],
        "rain": 0.8,
        "snow": 0.0,
        "thunder": 0.0
    },
    "504": {
        "name": "extreme rain",
        "day": [137,148,161],
        "night": [44,48,53],
        "rain": 1.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "511": {
        "name": "freezing rain",
        "day": [200,206,214],
        "night": [9,9,10],
        "rain": 0.2,
        "snow": 0.2,
        "thunder": 0.0
    },
    "520": {
        "name": "light intensity shower rain",
        "day": [207,210,215],
        "night": [29,30,31],
        "rain": 0.4,
        "snow": 0.0,
        "thunder": 0.0
    },
    "521": {
        "name": "shower rain",
        "day": [200,202,204],
        "night": [38,40,42],
        "rain": 0.6,
        "snow": 0.0,
        "thunder": 0.0
    },
    "522": {
        "name": "heavy intensity shower rain",
        "day": [188,190,193],
        "night": [36,37,38],
        "rain": 0.8,
        "snow": 0.0,
        "thunder": 0.0
    },
    "531": {
        "name": "ragged shower rain",
        "day": [178,178,179],
        "night": [23,25,28],
        "rain": 1.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "600": {
        "name": "light snow",
        "day": [247,247,247],
        "night": [47,46,43],
        "rain": 0.0,
        "snow": 0.2,
        "thunder": 0.0
    },
    "601": {
        "name": "snow",
        "day": [235,235,235],
        "night": [32,31,30],
        "rain": 0.0,
        "snow": 0.5,
        "thunder": 0.0
    },
    "602": {
        "name": "heavy snow",
        "day": [220,220,220],
        "night": [30,29,25],
        "rain": 0.0,
        "snow": 1.0,
        "thunder": 0.0
    },
    "611": {
        "name": "sleet",
        "day": [217,225,229],
        "night": [39,42,43],
        "rain": 0.3,
        "snow": 0.3,
        "thunder": 0.0
    },
    "612": {
        "name": "shower sleet",
        "day": [199,210,215],
        "night": [26,29,30],
        "rain": 0.6,
        "snow": 0.5,
        "thunder": 0.0
    },
    "615": {
        "name": "light rain and snow",
        "day": [221,224,226],
        "night": [36,38,39],
        "rain": 0.2,
        "snow": 0.3,
        "thunder": 0.0
    },
    "616": {
        "name": "rain and snow",
        "day": [203,204,205],
        "night": [37,38,38],
        "rain": 0.4,
        "snow": 0.5,
        "thunder": 0.0
    },
    "620": {
        "name": "light shower snow",
        "day": [247,247,247],
        "night": [47,46,43],
        "rain": 0.0,
        "snow": 0.6,
        "thunder": 0.0
    },
    "621": {
        "name": "shower snow",
        "day": [235,235,235],
        "night": [32,31,30],
        "rain": 0.0,
        "snow": 0.8,
        "thunder": 0.0
    },
    "622": {
        "name": "heavy shower snow",
        "day": [220,220,220],
        "night": [30,29,25],
        "rain": 0.0,
        "snow": 0.9,
        "thunder": 0.0
    },
    "701": {
        "name": "mist",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "711": {
        "name": "smoke",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "721": {
        "name": "haze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "731": {
        "name": "sand, dust whirls",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "741": {
        "name": "fog",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "751": {
        "name": "sand",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "761": {
        "name": "dust",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "762": {
        "name": "volcanic ash",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "771": {
        "name": "squalls",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "781": {
        "name": "tornado",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "800": {
        "name": "clear sky",
        "day": [82,197,252],
        "night": [25,27,66],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "801": {
        "name": "few clouds",
        "day": [110,183,239],
        "night": [27,28,56],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "802": {
        "name": "scattered clouds",
        "day": [146,196,234],
        "night": [31,32,55],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "803": {
        "name": "broken clouds",
        "day": [163,196,222],
        "night": [34,35,50],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "804": {
        "name": "overcast clouds",
        "day": [188,197,204],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "900": {
        "name": "tornado",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "901": {
        "name": "tropical storm",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "902": {
        "name": "hurricane",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "903": {
        "name": "cold",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "904": {
        "name": "hot",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "905": {
        "name": "windy",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "906": {
        "name": "hail",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "951": {
        "name": "calm",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "952": {
        "name": "light breeze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "953": {
        "name": "gentle breeze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "954": {
        "name": "moderate breeze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "955": {
        "name": "fresh breeze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "956": {
        "name": "strong breeze",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "957": {
        "name": "high wind, near gale",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "958": {
        "name": "gale",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "959": {
        "name": "severe gale",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "960": {
        "name": "storm",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "961": {
        "name": "violent storm",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    },
    "962": {
        "name": "hurricane",
        "day": [235,235,235],
        "night": [28,29,34],
        "rain": 0.0,
        "snow": 0.0,
        "thunder": 0.0
    }
},

restaurants = [
{
    "name": "NUOVU",
    "position": [-7,-12],
    "size": [2,1.4],
    "open": [[[11,12]],[[7,24]],[[0,1],[7,24]],[[0,1],[7,24]],[[0,1],[7,24]],[[0,1],[7,24]],[[0,1][11,12]]]
},{
    "name": "Route twenty-six",
    "position": [-6.5,-14],
    "size": [3,1.4],
    "open": [[[6.5,14]],[[6.5,10],[11.5,14],[18.5,23]],[[6.5,10],[11.5,14],[18.5,23]],[[6.5,10],[11.5,14],[18.5,23]],[[6.5,10],[11.5,14],[18.5,23]],[[6.5,10],[11.5,14],[18.5,23]],[[6.5,14]]]
},{
    "name": "Migros Restaurant",
    "position": [-19.5,-19.5],
    "size": [6,4.3],
    "open": [[],[[6.5,14]],[[6.5,14]],[[6.5,14]],[[6.5,14]],[[6.5,14]],[[6.5,12.25]]]
},{
    "name": "Migros",
    "position": [-19.5,-24],
    "size": [6,3.3],
    "open": [[],[[8,18]],[[8,18]],[[8,18]],[[8,18]],[[8,18]],[[9,14]]]
},{
    "name": "Arno's Bistro",
    "position": [-7,-20.2],
    "size": [2,1.4],
    "open": [[],[[11,14]],[[11,14]],[[11,14]],[[11,14]],[[11,14]],[]]
},{
    "name": "naanu",
    "position": [-6.5,-22.5],
    "size": [3,1.8],
    "open": [[],[[9,17]],[[9,17]],[[9,17]],[[9,14.5],[17,22]],[[9,14.5],[17,22]],[]]
},{
    "name": "Läbis Grill",
    "position": [-7,-24.7],
    "size": [2,1.4],
    "open": [[],[],[],[],[],[],[]]
},{
    "name": "Caffé Pascucci",
    "position": [-4.3,-18.6],
    "size": [1.4,2],
    "open": [[],[[9,15]],[[9,15]],[[9,15]],[[9,23]],[[9,23]],[18,24]]
},{
    "name": "coppolini",
    "position": [-2.4,-18.6],
    "size": [1.4,2],
    "open": [[],[[9,15]],[[9,15]],[[9,15]],[[9,23]],[[9,23]],[18,24]]
},{
    "name": "Neni",
    "position": [-2.6,-21.6],
    "size": [1.8,3],
    "open": [[[7.5,23]],[[6.5,23]],[[6.5,23]],[[6.5,23]],[[6.5,23]],[[6.5,23]],[[7.5,23]]]
}
]

online = true;

$(function(){
  $.get( "http://toni.fidelthomet.com/data/json/data.json", function( data ) {
    zvvData = data[1]
    for (var i=0; i< zvvData.toni.length; i++){
        if(new Date(zvvData.toni[i].time*1000).getTime()>=new Date().getTime()){
            connectionAtCurrentTimeT = i
            break
        }
    }
    for (var i=0; i< zvvData.fischerweg.length; i++){
        if(new Date(zvvData.fischerweg[i].time*1000).getTime()>=new Date().getTime()){
            connectionAtCurrentTimeF = i
            break
        }
    }

    getWeatherHistory()
}).fail(function() {

    online = false
    init();
    initScene()
    animate()


})
})

lerp = function(value1, value2, amt) {
    return ((value2 - value1) * amt) + value1;
};

map = function(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};


function getWeatherHistory(){
    $.get( "http://api.openweathermap.org/data/2.5/history/city?id=6295503&type=hour", function( data ) {

      for (var i = 0; i < data.list.length; i++) {
          weather.push({"clouds" : data.list[i].clouds.all, "id" : data.list[i].weather[0].id, "date" : data.list[i].dt*1000})
      };

      getWeatherCurrent()
  });
}

function getWeatherCurrent(){
    $.get( "http://api.openweathermap.org/data/2.5/weather?id=6295503", function( data ) {

      srt = new Date(data.sys.sunrise*1000)
      sunrise=srt.getHours()+srt.getMinutes()/60+srt.getSeconds()/60/60+srt.getMilliseconds()/60/60/1000
      sst = new Date(data.sys.sunset*1000)
      sunset=sst.getHours()+sst.getMinutes()/60+sst.getSeconds()/60/60+sst.getMilliseconds()/60/60/1000


      weather.push({"clouds" : data.clouds.all, "id" : data.weather[0].id, "date" : data.dt*1000})

      getWeatherForeCast()
  });
}

function getWeatherForeCast(){
    $.get( "http://api.openweathermap.org/data/2.5/forecast?id=6295503", function( data ) {

      for (var i = 0; i < data.list.length; i++) {
          weather.push({"clouds" : data.list[i].clouds.all, "id" : data.list[i].weather[0].id, "date" : data.list[i].dt*1000})
      };

      init();
      initScene()
      animate();
  });
}


function init() {
    var container;
    
    container = document.createElement('div');
    document.body.appendChild(container);
    
    camera = new THREE.OrthographicCamera( window.innerWidth * -camZoom, window.innerWidth * camZoom, window.innerHeight * camZoom, window.innerHeight * -camZoom, .01, 4000 );
    camera.position.set(camPosition[0],camPosition[1],camPosition[2])
    camera.lookAt(new THREE.Vector3(0,0,0))
    
    cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, .1, 100 );
    cameraOrtho.position.z = 10;
    
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xABCDEF,40);
    
    sceneOrtho = new THREE.Scene();
    
    group = new THREE.Object3D();
    barGroup = new THREE.Object3D()
    tramMinutes = new THREE.Object3D()
    // restaurantsObj = new THREE.Object3D()
    
    renderer = new THREE.WebGLRenderer({  antialias: true  });
    renderer.setSize( window.innerWidth*2, window.innerHeight*2 );
    renderer.autoClear = false;
    container.appendChild( renderer.domElement );
    $("canvas").css({width: (window.innerWidth)+"px", height: (window.innerHeight)+"px"})
    if(online)
        $("body").append("<div id='time'>12:30</time>")
    else
        $("body").append("<div id='time'>no network connection</br>tap to retry</time>")
    // $("#time").css({"position": "absolute","font-family": "HelveticaNeue-Bold","bottom": "10px","left": "0px","right": "0px","text-align": "center","font-size": "12px", "color":"rgb(38,38,38)"})
    
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', rotateStart, false );
    document.addEventListener( 'touchmove', rotate, false );
    document.addEventListener( 'touchend', rotateFinish, false );
    
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'orientationchange', function(e){
        camZoom*=(window.innerWidth/window.innerHeight)
        camera.left = window.innerWidth*-camZoom
        camera.right = window.innerWidth*camZoom
        camera.top = window.innerHeight*camZoom
        camera.bottom = window.innerHeight*-camZoom
        camera.updateProjectionMatrix()

        cameraOrtho.left= -window.innerWidth/2
        cameraOrtho.right= window.innerWidth/2
        cameraOrtho.top= window.innerHeight/2
        cameraOrtho.bottom= -window.innerHeight/2
        cameraOrtho.updateProjectionMatrix()

    }, false );
    
    document.addEventListener('gesturechange', zoom, false);
    document.addEventListener('gestureend', zoomFinish, false);
    
    calculateDropPositions()
    
    renderer.setClearColor(new THREE.Color(.95,.95,.95),0);
}

function initScene(){


    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(0,0,.6);
    var v2 = new THREE.Vector3(0,1,0);
    var v3 = new THREE.Vector3(0,1,.1);
    var v4 = new THREE.Vector3(0,0,.5);
    geom.vertices.push(v1,v2,v3,v4);
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 1, 0, 3 ));
    
    for (var i = 0; i < 90; i++) {
        // var matTA = new.THREE.
        
        // var depTA = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: lightColor, transparent: false, opacity: 0}));
        var depTB = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: lightColor, transparent: false, opacity: 0}));
        // var depFA = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: darkColor, transparent: false, opacity: 0}));
        var depFB = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: darkColor, transparent: false, opacity: 0}));
        
        // depTA.rotation.z = Math.PI/2
        // depTA.position.x=-11.6;
        // depTA.position.z=-9.5-.6*i
        
        depTB.rotation.z = Math.PI/2
        depTB.position.x=-9.6;
        depTB.position.z=-8.6+.6*i
        
        // depFA.rotation.z = Math.PI/2
        // depFA.position.x=35.5;
        // depFA.position.z=-9.5-.6*i
        
        depFB.rotation.z = Math.PI/2
        depFB.position.x=37.5;
        depFB.position.z=-8.6+.6*i
        
        // objects.departures.toniA.push(depTA)
        objects.departures.toniB.push(depTB)
        // objects.departures.fischerwegA.push(depFA)
        objects.departures.fischerwegB.push(depFB)
        
        tramMinutes.add(objects.departures.toniB[i],objects.departures.fischerwegB[i]);
        
        
    };
    for (var i = 0; i < 60; i++) {
        // var matTA = new.THREE.
        
        var depTA = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: lightColor, transparent: false, opacity: 0}));
        // var depTB = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: lightColor, transparent: false, opacity: 0}));
        var depFA = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: darkColor, transparent: false, opacity: 0}));
        // var depFB = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({color: darkColor, transparent: false, opacity: 0}));
        
        depTA.rotation.z = Math.PI/2
        depTA.position.x=-11.6;
        depTA.position.z=-9.5-.6*i
        
        // depTB.rotation.z = Math.PI/2
        // depTB.position.x=-9.6;
        // depTB.position.z=-8.6+.6*i
        
        depFA.rotation.z = Math.PI/2
        depFA.position.x=35.5;
        depFA.position.z=-9.5-.6*i
        
        // depFB.rotation.z = Math.PI/2
        // depFB.position.x=37.5;
        // depFB.position.z=-8.6+.6*i
        
        objects.departures.toniA.push(depTA)
        // objects.departures.toniB.push(depTB)
        objects.departures.fischerwegA.push(depFA)
        // objects.departures.fischerwegB.push(depFB)
        
        tramMinutes.add(objects.departures.toniA[i],objects.departures.fischerwegA[i]);
        
        
    };
    
    // var object = new THREE.Mesh( geom, materialToni );
    // var object2 = new THREE.Mesh( geom, materialToni );
    // var object3 = new THREE.Mesh( geom, materialToni );
    
    // object.rotation.z = Math.PI/2
    // object.position.x=-11.9;
    // object.position.z=-10.5
    
    // object2.rotation.z = Math.PI/2
    // object2.position.x=-11.9;
    // object2.position.z=-10.5-1.7
    
    // object3.rotation.z = Math.PI/2
    // object3.position.x=-9.7;
    // object3.position.z=-9.7+1.7
    // // object.rotation.x = -Math.PI/2
    
    
    var radius = 50;
    var segments = 32*2;
    
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    objects.ground = new THREE.Mesh( circleGeometry, materialBack );
    objects.ground.rotation.x = -Math.PI/2
    // group.add( objects.ground );
    
    var geometry = new THREE.BoxGeometry( 17, 4, 9 );
    objects.toni.push(new THREE.Mesh( geometry, materialToni ));
    objects.toni[0].position.y=2;
    
    var geometry2 = new THREE.BoxGeometry( 1, 30, 1 );
    redBar = (new THREE.Mesh( geometry2, new THREE.MeshBasicMaterial({color: 0xff0000}) ));
    redBar.position.y=-window.innerHeight/2+15;
    
    var geom2 = new THREE.Geometry();
    var v12 = new THREE.Vector3(0,0,0);
    var v22 = new THREE.Vector3(-20,20,0);
    var v32 = new THREE.Vector3(-20,-20,0);
    geom2.vertices.push(v12,v22,v32);
    
    geom2.faces.push( new THREE.Face3( 0, 1, 2 ));
    // geom2.faces.push( new THREE.Face3( 1, 2, 0 ));
    // geom2.faces.push( new THREE.Face3( 2, 0, 1 ));
    
    triangle = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 2),  materialToni);
    
    triangle.rotation.z = Math.PI*.25
    // triangle.position.x=-9.6;
    triangle.position.y=-window.innerHeight/2
    // depTB.position.z=-8.6+.6*i
    
    
    var tramLaneGeometry = new THREE.BoxGeometry( .08, .1, 90);
    var tramLane4 = new THREE.Mesh( tramLaneGeometry, materialToni )
    var tramLane14 = new THREE.Mesh( tramLaneGeometry, materialToni )
    tramLane4.position.x=-11.1
    tramLane14.position.x=36
    if(online)
        group.add(tramLane4,tramLane14)
    
    var barGeometry = new THREE.BoxGeometry( 1, 10, 1 );
    var smallBarGeometry = new THREE.BoxGeometry( 1, 2, 1 );
    
    barGroupOffset= map(time%3600000,0,3600000,barSpace,0)
    
    for (var i = 0; i < 32; i++) {
        var bar = (new THREE.Mesh( barGeometry, materialToni ));
        bar.position.y=-window.innerHeight/2+2.5;
        bar.position.x=-(i-16)*barSpace+barGroupOffset;
        
        
        var barS1 = (new THREE.Mesh( smallBarGeometry, materialToni ));
        barS1.position.y=-window.innerHeight/2+1;
        barS1.position.x=-(i-16)*barSpace+barSpace/4+barGroupOffset;
        
        var barS2 = (new THREE.Mesh( smallBarGeometry, materialToni ));
        barS2.position.y=-window.innerHeight/2+1;
        barS2.position.x=-(i-16)*barSpace+barSpace/2+barGroupOffset;
        
        var barS3 = (new THREE.Mesh( smallBarGeometry, materialToni ));
        barS3.position.y=-window.innerHeight/2+1;
        barS3.position.x=-(i-16)*barSpace+barSpace*.75+barGroupOffset;
        
        barGroup.add(bar,barS1, barS2, barS3)
    };
    
    
    objects.toni.push(new THREE.Mesh( new THREE.BoxGeometry( 4, 6, 9 ), materialToni ));
    objects.toni[1].position.y=7;
    objects.toni[1].position.x=-6.5;
    group.add( objects.toni[0], objects.toni[1]);

    var tram = new THREE.Geometry();
    var t1 = new THREE.Vector3(0,0,5.6);
    var t2 = new THREE.Vector3(0,1,.0);
    var t3 = new THREE.Vector3(0,1,5.1);
    var t4 = new THREE.Vector3(0,0,.5);
    tram.vertices.push(t1,t2,t3,t4);
    tram.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 1, 0, 3 ));
    

    objects.tramTA=(new THREE.Mesh( tram, materialToni ));
    objects.tramTA.position.x=-11.6;
    objects.tramTA.position.z=-50
     objects.tramTA.rotation.z = Math.PI/2
    group.add( objects.tramTA);
    
    
    
    // var light = new THREE.AmbientLight( 0x353535	 );
    // group.add( light );
    // var light = new THREE.PointLight( 0xcccccc, 1, 100 );
    // light.position.set( 0, 20, 0 );
    // group.add( light );
    
//    for (var i = connectionAtCurrentTimeT; i < zvvData.toni.length; i++) {
//        if(!zvvData.toni[i].toCity){
//            var inMinutes = Math.floor((new Date(zvvData.toni[i].time*1000).getTime()-time)/60000)
//            
//            if(inMinutes>=0){
//                
//                objects.tram1 = createText(inMinutes+"\'")
//                objects.tram1.position.x=-17;
//                break;
//            }
//        }
//    };
//    
//    for (var i = connectionAtCurrentTimeT; i < zvvData.toni.length; i++) {
//        if(zvvData.toni[i].toCity){
//            var inMinutes = Math.floor((new Date(zvvData.toni[i].time*1000).getTime()-time)/60000)
//            
//            if(inMinutes>=0){
//                
//                objects.tram2 = createText(inMinutes+"\'")
//                objects.tram2.position.x=-17;
//                break;
//            }
//        }
//    };

    // 	var geometry = new THREE.PlaneGeometry( 5, 20 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // var plane = new THREE.Mesh( geometry, material );
    // scene.add( plane );
    
    var texture1 = THREE.ImageUtils.loadTexture( "gradient.png" );
    var material1 = new THREE.MeshBasicMaterial( { color: 0x000000, map: texture1,transparent: true } );
    var geometry1 = new THREE.PlaneGeometry( 100, 100 );
    gradient = new THREE.Mesh(geometry1 , material1 )
    gradient.rotation.x = -Math.PI/2
    gradient.position.y=.1
    
    if(online)
        group.add(gradient)

    for (var i = 0; i < restaurants.length; i++) {
        restaurants[i]

        var geometryR = new THREE.BoxGeometry( restaurants[i].size[0], restaurants[i].size[1] , .5);
        var restaurant = new THREE.Mesh(geometryR,new THREE.MeshBasicMaterial( { color: darkColor} ))
        restaurantsObj.push(restaurant)

        restaurant.rotation.x = -Math.PI/2
        restaurant.position.x = restaurants[i].position[0]
        restaurant.position.z = restaurants[i].position[1]
        restaurant.position.y = .25

        group.add(restaurantsObj[i])
    };

    
    
//    var texture1 = THREE.ImageUtils.loadTexture( "gradient.png" );
//    var material1 = new THREE.MeshBasicMaterial( { color: 0x000000, map: texture1,transparent: true } );
//    var geometry1 = new THREE.PlaneGeometry( 100, 100 );
//    gradient = new THREE.Mesh(geometry1 , material1 )
//    gradient.rotation.x = -Math.PI/2
//    gradient.position.y=.1
//    
//    if(online)
//        group.add(gradient)

    // group.add(objects.tram1,objects.tram2);
    
    
    // 	group.remove(objects.tram1)
    // objects.tram1 = createText("5\'")
    // group.add(objects.tram1)
    
//    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
//    directionalLight.position.set( -5, 1, -10 );
//    group.add( directionalLight );
//    var directionalLight = new THREE.DirectionalLight( 0x555555, 0.5 );
//    directionalLight.position.set( 5, 1, 10 );
//    group.add( directionalLight );

if(online)
    group.add(tramMinutes)

scene.add(group)
sceneOrtho.add(barGroup,triangle)


resetView()

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(event) {

}

function createText(text) {
//    var shape = new THREE.TextGeometry(text, {font: 'helvetiker'});
//    // var wrapper = new THREE.MeshNormalMaterial({color: 0x00ff00});
//    // objects.tram1 = new THREE.Mesh(shape, materialToni);
//    var text = new THREE.Mesh(shape, materialBack);
//    
//    text.scale.z=.001
//    text.scale.x=.014
//    text.scale.y=.014
//    text.position.z=-9
//    text.position.x=-11
//    text.rotation.z = -Math.PI/2
//    text.rotation.x = -Math.PI/2
//    
//    return text;
}

function createTextWoPositioning(text) {
//    var shape = new THREE.TextGeometry(text, {font: 'helvetiker'});
//    var text = new THREE.Mesh(shape, materialToni);
//    text.scale.z=.001
//    text.scale.x=.11
//    text.scale.y=.11
//    
//    // text.rotation.z = -Math.PI/2
//    // text.rotation.x = -Math.PI/2
//    
//    return text;


}

function rotateStart( e ) {
    e.preventDefault()
    
    
    
    
    if(e.touches.length>1)
        return

    var now = new Date().getTime();
    var timesince = now - mylatesttap;
    if((timesince < 350) && (timesince > 0)){
        resettingView = true;
        resetView()
        return
    }
    
    mylatesttap = new Date().getTime();
    
    if(e.touches[0].clientY>window.innerHeight-48){
        settingTime = true
        $("#time").addClass("active")
        if(!online){
            location.reload()
        }
    }
    
    touchstart.x=e.touches[0].clientX;
    touchstart.y=e.touches[0].clientY;
    
}

function rotate(e) {
    e.preventDefault()
    if(e.touches.length>1){
        for(var i=0; i < e.touches.length; i++){
            multiTouches[multiTouchId]=e.touches[i].identifier
            multiTouchId++;
            multiTouchId%=5;
        }
        return
    }
    for (var i = multiTouches.length - 1; i >= 0; i--) {
        if(multiTouches[i]==e.touches[0].identifier)
            return
    };
    
    if(settingTime){
        setTime(e)
        return
    }
    
    if(resettingView)
        return

        // group.rotation.z=
        var newCamY = rotation.z-(touchstart.y-e.touches[0].clientY)*.2
        
        
        if(newCamY>100)
            newCamY=100
        if(newCamY<0)
            newCamY=0

        new TWEEN.Tween( {c: camera.position.y, ry: group.rotation.y})
        .to( {c: newCamY, ry: rotation.y+(touchstart.x-e.touches[0].clientX)*-.01}, 50 )
        .easing( TWEEN.Easing.Linear.None)
        .onUpdate(
          function(){
              camera.position.setY(this.c)
              camera.position.setX(100-this.c)
              camera.lookAt(new THREE.Vector3(0,0,0))

              group.rotation.y=this.ry
          }
          )
        .start();

    // camera.position.setY(newCamY)
    // camera.lookAt(new THREE.Vector3(0,0,0))
    
    // group.rotation.y=rotation.y+(touchstart.x-e.touches[0].clientX)*-.01
    
    
}

function rotateFinish(e) {
    e.preventDefault()
    if(e.touches.length>1)
        return
    for (var i = multiTouches.length - 1; i >= 0; i--) {
        if(multiTouches[i]==e.changedTouches[0].identifier)
            return
    }
    
    if(settingTime){
        finishTime(e)
        settingTime=false;
        $("#time").removeClass("active")
        sceneOrtho.remove(objects.time)
        stringTime=""
        return
    }
    
    if(resettingView)
        return

    var newCamY = rotation.z-(touchstart.y-e.changedTouches[0].clientY)*.2

    if(newCamY>100)
        newCamY=100
    if(newCamY<0)
        newCamY=0

    new TWEEN.Tween( {c: camera.position.y, ry: group.rotation.y})
    .to( {c: newCamY, ry: rotation.y+(touchstart.x-e.changedTouches[0].clientX)*-.01}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(
      function(){
          camera.position.setY(this.c)
          camera.position.setX(100-this.c)
          camera.lookAt(new THREE.Vector3(0,0,0))

          group.rotation.y=this.ry

          rotation.y=this.ry;
          rotation.z=this.c;
      }
      )
    .onComplete(function(){
        rotation.y=this.ry;
        rotation.z=this.c;
    })
    .start();
    
    
    // camera.position.setY(newCamY)
    // camera.lookAt(new THREE.Vector3(0,0,0))
    
    // group.rotation.y=rotation.y+(touchstart.x-e.changedTouches[0].clientX)*-.01
    // rotation.y=group.rotation.y;
    // rotation.z=camera.position.y;
}

function zoom(e) {
    e.preventDefault()
    var left=window.innerWidth*-camZoom*(1/e.scale)
    var top=window.innerHeight*camZoom*(1/e.scale)
    
    if(left<-50){
        left=-50;
        top=-left*(window.innerHeight/window.innerWidth)
    }
    
    if(left>-15){
        left=-15;
        top=-left*(window.innerHeight/window.innerWidth)
    }
    
    new TWEEN.Tween( {l: camera.left, r: camera.right, t: camera.top, b: camera.bottom})
    .to( {l: left, r: -left, t: top, b: -top}, 50 )
    .easing( TWEEN.Easing.Linear.None)
    .onUpdate(
      function(){
          camera.left = this.l
          camera.right = this.r
          camera.top = this.t
          camera.bottom = this.b
          camera.updateProjectionMatrix()
      }
      )
    .start();
}

function zoomFinish(e) {

    var left=window.innerWidth*-camZoom*(1/e.scale)
    var top=window.innerHeight*camZoom*(1/e.scale)
    
    if(left<-50){

        left=-50;
        top=-left*(window.innerHeight/window.innerWidth)
    }
    
    if(left>-15){
        left=-15;
        top=-left*(window.innerHeight/window.innerWidth)
    }
    
    new TWEEN.Tween( {l: camera.left, r: camera.right, t: camera.top, b: camera.bottom})
    .to( {l: left, r: -left, t: top, b: -top}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(function(){
      camera.left = this.l
      camera.right = this.r
      camera.top = this.t
      camera.bottom = this.b
      camera.updateProjectionMatrix()
  })
    .onComplete(function(){
        camZoom=-left/window.innerWidth;
    })
    .start();
}

function setTime(e){

    // new TWEEN.Tween( {t: time})
    // .to( {t: time+(touchstart.x-e.touches[0].clientX)*20000}, 50 )
    // .easing( TWEEN.Easing.Linear.None)
    // .onUpdate(function(){
    // 	time = this.t
    // })
    // .start();
    
    
    time=time+(touchstart.x-e.touches[0].clientX)*20000
    touchstart.x=e.touches[0].clientX
    // console.log(time)
}

function finishTime(e){


    // new TWEEN.Tween( {t: time})
    // .to( {t: time+(touchstart.x-e.changedTouches[0].clientX)*20000}, 400 )
    // .easing( TWEEN.Easing.Quartic.Out)
    // .onUpdate(function(){
    // 	time = this.t
    // })
    // .start();
}

function updateDay(){
    if(new Date().getTime()>launchTime+3600000){
        location.reload();
    }

    if (time > launchTime+43200000)
        time = launchTime+43200000

    if (time < launchTime-43200000)
        time = launchTime-43200000

    var newDateTimed = new Date().getTime()
    if (lastDateTimed){
        time+=newDateTimed-lastDateTimed;

        var timeDiff = newDateTimed-lastDateTimed;
        if (timeDiff>50) {
            timeDiff=50;
        };
        for (var i = 0; i < timeDiff; i++) {
            if(Math.random()<rainChance)
                createDrop();
        };

        for (var i = 0; i < timeDiff; i+=3) {
            if(Math.random()<snowChance)
                createFlake();
        };

    }
    
    
    
    
    
    barGroup.position.x = map((launchTime-time)%3600000,0,3600000,0,barSpace)
    
    
    var newStringTime = new Date(time).getHours()+""
    if(newStringTime<10){
        newStringTime = "0"+newStringTime+":"
    } else {
        newStringTime = newStringTime+":"
    }
    
    var newStringTimeMin = new Date(time).getMinutes()+""
    if(newStringTimeMin<10){
        newStringTime = newStringTime+"0"+newStringTimeMin;
    } else {
        newStringTime = newStringTime+newStringTimeMin;
    }
    
    

    
    
    var cT = new Date(time);
    var timeInHours = cT.getHours()+cT.getMinutes()/60+cT.getSeconds()/60/60+cT.getMilliseconds()/60/60/1000
    
    dayLight = Math.abs(timeInHours-12)
    
    
    for (var i = 0; i < weather.length; i++) {
        if(weather[i].date>time){
            if(isDay){
                var r = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].day[0],weatherCodes[weather[i].id].day[0])
                var g = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].day[1],weatherCodes[weather[i].id].day[1])
                var b = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].day[2],weatherCodes[weather[i].id].day[2])
            } else {
                var r = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].night[0],weatherCodes[weather[i].id].night[0])
                var g = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].night[1],weatherCodes[weather[i].id].night[1])
                var b = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].night[2],weatherCodes[weather[i].id].night[2])
            }
            
            clearColor = new THREE.Color(r/255,g/255,b/255)
            
            
            new TWEEN.Tween( {r: renderer.getClearColor().r, g: renderer.getClearColor().g, b: renderer.getClearColor().b})
            .to( {r: r/255, g: g/255, b: b/255}, 400 )
            .easing( TWEEN.Easing.Quartic.Out)
            .onUpdate(function(){
                      // objects.toni[0].material.color.set(new THREE.Color(this.t,this.t,this.t))
                      renderer.setClearColor(new THREE.Color(this.r,this.g,this.b),0);
                      gradient.material.color.set(new THREE.Color(this.r,this.g,this.b),0);
                      // objects.ground.material.color.set(new THREE.Color(this.g,this.g,this.g))
                  })
            .onComplete(function(){
                renderer.setClearColor(new THREE.Color(this.r,this.g,this.b),0);
                gradient.material.color.set(new THREE.Color(this.r,this.g,this.b),0);
            })
            .start();
            
            
            rainChance = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].rain,weatherCodes[weather[i].id].rain)
            snowChance = map(time,weather[i-1].date,weather[i].date,weatherCodes[weather[i-1].id].snow,weatherCodes[weather[i].id].snow)
            
            // renderer.setClearColor(new THREE.Color(r/255,g/255,b/255),0);
            // console.log(weatherCodes[weather[i-1].id].name)
            break;
        }
    };
    
    
    if ((timeInHours>sunrise&&lastTimeInHours<=sunrise&&timeInHours<sunset)||(timeInHours<sunset&&lastTimeInHours>=sunset&&timeInHours>sunrise)||(timeInHours<sunset&&timeInHours>sunrise&&lastTimeInHours==-1)) {
        // console.log(timeInHours)
        // console.log(sunrise)
        // console.log(sunset)
        // console.log("---")
        for(var i = 0; i < tramMinutes.children.length; i++){
            tweenDepartureColor(tramMinutes.children[i],darkColor)
        }
        
        isDay = true;
        $("#time").removeClass("night")
        new TWEEN.Tween( {t: .95, g: .15 })
        .to( {t: .15, g: .95}, 1000 )
        .easing( TWEEN.Easing.Quartic.Out)
        .onUpdate(function(){
          objects.toni[0].material.color.set(new THREE.Color(this.t,this.t,this.t))
                  // renderer.setClearColor(new THREE.Color(this.g,this.g,this.g),0);
                  objects.ground.material.color.set(new THREE.Color(this.g,this.g,this.g))
              })
        .onComplete(function(){
            objects.toni[0].material.color.set(new THREE.Color(0.15,0.15,0.15))
            objects.ground.material.color.set(new THREE.Color(0.95,0.95,0.95))
        })
        .start();
    }
    
    if ((timeInHours<sunrise&&lastTimeInHours>=sunrise&&lastTimeInHours<=sunset)||(timeInHours>sunset&&lastTimeInHours<=sunset&&lastTimeInHours>=sunrise)||((timeInHours>=sunset||timeInHours<=sunrise)&&lastTimeInHours==-1)) {
        // console.log(timeInHours)
        // console.log(sunrise)
        // console.log(sunset)
        // console.log("---")
        isDay = false;
        
        for(var i = 0; i < tramMinutes.children.length; i++){
            tweenDepartureColor(tramMinutes.children[i],lightColor)
        }
        
        $("#time").addClass("night")
        new TWEEN.Tween( {t: .15, g: .95 })
        .to( {t: .95, g: .15}, 1000 )
        .easing( TWEEN.Easing.Quartic.Out)
        .onUpdate(function(){
          objects.toni[0].material.color.set(new THREE.Color(this.t,this.t,this.t))
                  // renderer.setClearColor(new THREE.Color(this.g,this.g,this.g),0);
                  objects.ground.material.color.set(new THREE.Color(this.g,this.g,this.g))
              })
        .onComplete(function(){
            objects.toni[0].material.color.set(new THREE.Color(0.95,0.95,0.95))
            objects.ground.material.color.set(new THREE.Color(0.15,0.15,0.15))
        })
        .start();
    }

    for (var i = 0; i < restaurants.length; i++) {
        var currentDay = new Date(time).getDay()
        var isOpen = false
        for (var j = 0; j < restaurants[i].open[currentDay].length; j++) {
            var open = restaurants[i].open[currentDay][j]
            if((timeInHours > open[0] && timeInHours < open[1])){
                isOpen = true;
            }
            // if((timeInHours < open[0] || timeInHours > open[1])){
            //     tweenDepartureOpacity(restaurantsObj[i],0)
            // }
        }
        if(isOpen){
            tweenRestaurantOpacity(restaurantsObj[i],1)
        } else {
            tweenRestaurantOpacity(restaurantsObj[i],0)
        }
    }

    if(stringTime!=newStringTime||isDay!=lastIsDay){
        updateDepartures()
        if (stringTime=="") {
            stringTime="..."
        } else {
            stringTime=newStringTime;
        }
        

        // if (settingTime){
        // sceneOrtho.remove(objects.time)
        $("#time").text(newStringTime)
        
        // objects.time = createTextWoPositioning(newStringTime)
        // objects.time.position.y=-window.innerHeight/2+35;
        // objects.time.position.x=-18;
        // sceneOrtho.add(objects.time)
        
        // }
        
        
    }
    
    
    
    // renderer.setClearColor( new THREE.Color( map(dayLight,12,0, 0/255 ,122/255),map(dayLight,12,0, 38/255, 188/255),map(dayLight,12,0, 77/255, 1)),0);
    lastIsDay = isDay
    lastDayLight=dayLight
    lastTimeInHours = timeInHours
    lastDateTimed = newDateTimed;
}

function updateDepartures(){
    // group.remove(tramMinutes);
    // tramMinutes = new THREE.Object3D();
    
    for (var i = connectionAtCurrentTimeT-5; i < zvvData.toni.length; i++) {
        if(zvvData.toni[i].toCity){
            var inMinutes = Math.floor((new Date(zvvData.toni[i].time*1000).getTime()-time)/60000)
            
            if(inMinutes>=0){
                if(inMinutes==0){
                    // console.log("3")
                    // animateTram(objects.tramTA)
                }

                for (var i = 0; i < objects.departures.toniA.length; i++) {
                    // if((i<inMinutes&&isDay)||(i>=inMinutes&&!isDay))
                    // 	tweenDepartureColor(objects.departures.toniA[i],darkColor)
                    // else
                    // 	tweenDepartureColor(objects.departures.toniA[i],lightColor)
                    if(i<inMinutes){
                        tweenDepartureOpacity(objects.departures.toniA[i],1)
                    }else{
                        tweenDepartureOpacity(objects.departures.toniA[i],0)
                    }
                };
                lastDepartures.toniA=inMinutes;
                break;
            }
        } 
    }
    for (var i = connectionAtCurrentTimeT-5; i < zvvData.toni.length; i++) {
        if(!zvvData.toni[i].toCity){
            var inMinutes = Math.floor((new Date(zvvData.toni[i].time*1000).getTime()-time)/60000)
            
            if(inMinutes>=0){
                for (var i = 0; i < objects.departures.toniB.length; i++) {
                    // 	if((i<inMinutes&&isDay)||(i>=inMinutes&&!isDay))
                    // 		tweenDepartureColor(objects.departures.toniB[i],darkColor)
                    // 	else
                    // 		tweenDepartureColor(objects.departures.toniB[i],lightColor)
                    
                    
                    if(i<inMinutes){
                        tweenDepartureOpacity(objects.departures.toniB[i],1)
                    }else{
                        tweenDepartureOpacity(objects.departures.toniB[i],0)
                    }
                }
                lastDepartures.toniB=inMinutes;
                connectionAtCurrentTimeT=i
                break;
            }
        } 
    };
    
    for (var i = connectionAtCurrentTimeF-5; i < zvvData.fischerweg.length; i++) {
        if(zvvData.fischerweg[i].toCity){
            var inMinutes = Math.floor((new Date(zvvData.fischerweg[i].time*1000).getTime()-time)/60000)
            
            if(inMinutes>=0){
                for (var i = 0; i < objects.departures.fischerwegA.length; i++) {
                    // if((i<inMinutes&&isDay)||(i>=inMinutes&&!isDay))
                    // 	tweenDepartureColor(objects.departures.fischerwegA[i],darkColor)
                    // else
                    // 	tweenDepartureColor(objects.departures.fischerwegA[i],lightColor)
                    
                    if(i<inMinutes){
                        tweenDepartureOpacity(objects.departures.fischerwegA[i],1)
                    }else{
                        tweenDepartureOpacity(objects.departures.fischerwegA[i],0)
                    }
                };
                lastDepartures.fischerwegA=inMinutes;
                break;
            }
        } 
    }
    for (var i = connectionAtCurrentTimeF-5; i < zvvData.fischerweg.length; i++) {
        if(!zvvData.fischerweg[i].toCity){
            var inMinutes = Math.floor((new Date(zvvData.fischerweg[i].time*1000).getTime()-time)/60000)
            
            if(inMinutes>=0){
                for (var i = 0; i < objects.departures.fischerwegB.length; i++) {
                    // if((i<inMinutes&&isDay)||(i>=inMinutes&&!isDay))
                    // 	tweenDepartureColor(objects.departures.fischerwegB[i],darkColor)
                    // else
                    // 	tweenDepartureColor(objects.departures.fischerwegB[i],lightColor)
                    
                    if(i<inMinutes){
                        tweenDepartureOpacity(objects.departures.fischerwegB[i],1)
                    }else{
                        tweenDepartureOpacity(objects.departures.fischerwegB[i],0)
                    }
                };
                lastDepartures.fischerwegB=inMinutes;
                connectionAtCurrentTimeF=i
                break;
            }
        } 
    };
    
    // group.add(objects.tram1,objects.tram2);
}

function animateTram(tram){
    new TWEEN.Tween( {t: -50 })
            .to( {t: -50}, 30000 )
            .easing( TWEEN.Easing.Quartic.In)
            .onUpdate(function(){
              tram.position.z=this.t
    }).onComplete(function(){
        new TWEEN.Tween( {t: -50 })
            .to( {t: -14.5}, 10000 )
            .easing( TWEEN.Easing.Quartic.Out)
            .onUpdate(function(){
              tram.position.z=this.t
        }).onComplete(function(){
            new TWEEN.Tween( {t: -14.5 })
                .to( {t: -14.5}, 15000 )
                .easing( TWEEN.Easing.Quartic.In)
                .onUpdate(function(){
                  tram.position.z=this.t
            }).onComplete(function(){
                 new TWEEN.Tween( {t: -14.5 })
                    .to( {t: 50}, 10000 )
                    .easing( TWEEN.Easing.Quartic.In)
                    .onUpdate(function(){
                      tram.position.z=this.t
                }).onComplete(function(){
                    tram.position.z=50
                }).start()
            }).start()
        }).start()
    }).start()

    // window.setTimeout(
    //     function(){
    //         console.log("e")
    //         new TWEEN.Tween( {t: -50 })
    //         .to( {t: -14.5}, 10000 )
    //         .easing( TWEEN.Easing.Quartic.In)
    //         .onUpdate(function(){
    //           tram.position.z=this.t
    //       })
    //         .onComplete(function(){
    //             tram.position.z=-14.5

    //             window.setTimeout(
    //                 function(){
    //                     new TWEEN.Tween( {t: -14.5 })
    //                     .to( {t: 46}, 10000 )
    //                     .easing( TWEEN.Easing.Quartic.Out)
    //                     .onUpdate(function(){
    //                       tram.position.z=this.t
    //                   })
    //                     .onComplete(function(){
    //                         tram.position.z=-50
    //                     })
    //                     .start();
    //                 }, 20000
    //                 )
    //         })
    //         .start();
    //     }, 30000
    //     )
}

function tweenDepartureColor(item,color){
    new TWEEN.Tween( {t: item.material.color.r })
    .to( {t: color.r}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(function(){
      item.material.color.set(new THREE.Color(this.t,this.t,this.t))
  })
    .onComplete(function(){
        item.material.color.set(color)
    })
    .start();
}

function tweenDepartureOpacity(item,opacity){
    if(opacity){
        var newPosition = 0

        if(isDay)
            var color = darkColor
        else
            var color = lightColor
    }else{
        var color = clearColor
        var newPosition = -1
    }
    


    
    new TWEEN.Tween( {r: item.material.color.r, g: item.material.color.g, b: item.material.color.b, y: item.position.y })
    .to( {r: color.r,g: color.g,b: color.b, y: newPosition}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(function(){
      item.material.color.set(new THREE.Color(this.r,this.g,this.b))
      item.position.y=this.y
  })
    .onComplete(function(){
        item.material.color.set(color)
        item.position.y=newPosition
    })
    .start();
}

function tweenRestaurantOpacity(item,opacity){
    if(opacity){
        var newPosition = .25
        if(isDay)
            var color = darkColor
        else
            var color = lightColor
    }else{
        var color = clearColor
        var newPosition = -4
    }
    


    
    new TWEEN.Tween( {r: item.material.color.r, g: item.material.color.g, b: item.material.color.b, y: item.position.y })
    .to( {r: color.r,g: color.g,b: color.b, y: newPosition}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(function(){
      item.material.color.set(new THREE.Color(this.r,this.g,this.b))
      item.position.y=this.y
  })
    .onComplete(function(){
        item.material.color.set(color)
        item.position.y=newPosition
    })
    .start();
}

// function tweenDepartureOpacity(item,opacity){
// 	new TWEEN.Tween( {t: item.material.opacity })
// 	.to( {t: opacity}, 400 )
// 	.easing( TWEEN.Easing.Quartic.Out)
// 	.onUpdate(function(){
// 		item.material.opacity=this.t
// 	})
// 	.onComplete(function(){
// 		item.material.opacity=opacity
// 	})
// 	.start();
// }

function resetView(){

    var left=window.innerWidth*-.072
    var top=window.innerHeight*.072
    
    // time = new Date().getTime()
    
    new TWEEN.Tween( {t: time})
    .to( {t: new Date().getTime()}, 400 )
    .easing( TWEEN.Easing.Quartic.Out)
    .onUpdate(function(){
      time = this.t
  })
    .start();
    
    new TWEEN.Tween( {l: camera.left, r: camera.right, t: camera.top, b: camera.bottom})
    .to( {l: left, r: -left, t: top, b: -top}, 400 )
    .easing( TWEEN.Easing.Quartic.InOut)
    .onUpdate(function(){
      camera.left = this.l
      camera.right = this.r
      camera.top = this.t
      camera.bottom = this.b
      camera.updateProjectionMatrix()
  })
    .onComplete(function(){
        camZoom=-left/window.innerWidth;
        $("#loading").css({opacity:0})
    })
    .start();
    
    var newCamY = 100
    
    if(group.rotation.y%(Math.PI*2)>=Math.PI)
        var rotateTo = Math.round(group.rotation.y/(Math.PI*2))*(Math.PI*2)-Math.PI
    else
        var rotateTo = Math.round(group.rotation.y/(Math.PI*2))*(Math.PI*2)+Math.PI

    new TWEEN.Tween( {c: camera.position.y, ry: group.rotation.y})
    .to( {c: 100, ry: rotateTo}, 400 )
    .easing( TWEEN.Easing.Quartic.InOut)
    .onUpdate(
      function(){
          camera.position.setY(this.c)
          camera.position.setX(100-this.c)
          camera.lookAt(new THREE.Vector3(0,0,0))

          group.rotation.y=this.ry
      }
      )
    .onComplete(function(){
        rotation.y=group.rotation.y;
        rotation.z=camera.position.y;
        resettingView = false;
    })

    .start();
}

function animate(time) {
    requestAnimationFrame( animate );
    TWEEN.update( time );
    if(online)
        updateDay();
    render();
}

function render() {
    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    if(online)
        renderer.render( sceneOrtho, cameraOrtho );
}


function createDrop(){



    if(camera.position.y>90){
        var drop = new THREE.Mesh(new THREE.BoxGeometry( .1, 1+Math.random()*3, .1), materialToni)
    } else {
        var drop = new THREE.Mesh(new THREE.BoxGeometry( .03, 1+Math.random()*3, .03), materialToni)
    }
    group.add(drop)
    
    // dV = new THREE.Vector2(Math.random()*100-50,Math.random()*100-50)
    // if(dV.lengthSq()>2000)
    // 	return
    
    drop.position.x=dropPositions[dropIndex][0]
    drop.position.z=dropPositions[dropIndex][1]
    dropIndex++;
    dropIndex%=10000;
    
    drop.position.y=100
    new TWEEN.Tween( {y: drop.position.y})
    .to( {y: 1.5}, 400+200*Math.random() )
    .easing( TWEEN.Easing.Linear.None)
    .onUpdate(
      function(){
              // console.log(drop)
              drop.position.y=this.y;
          }
          )
    .onComplete(function(){
        group.remove(drop)
    }).start()
    
}

function createFlake(){
    var drop = new THREE.Mesh(new THREE.BoxGeometry( .1, .1, .1), materialToni)
    group.add(drop)
    drop.position.x=dropPositions[dropIndex][0]
    drop.position.z=dropPositions[dropIndex][1]
    dropIndex++;
    dropIndex%=10000;
    drop.position.y=100
    
    new TWEEN.Tween( {y: drop.position.y})
    .to( {y: 0}, 3000 )
    .easing( TWEEN.Easing.Linear.None)
    .onUpdate(
      function(){
              // console.log(drop)
              drop.position.y=this.y;
          }
          )
    .onComplete(function(){
        group.remove(drop)
    }).start()
    
}

function calculateDropPositions(){
    // console.log("calc")
    for (var i = 0; i < 10000; i++) {
        var x = Math.random()*100-50
        var y = Math.random()*100-50
        
        if(x*x+y*y>2000){
            i--
        } else {
            dropPositions.push([x,y])
        }
    };
}
