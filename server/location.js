function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
function getFindMeZip(zip){
  var a = "";
  fs = require('fs');
  fs.readfile('zipdb','utf8',function(err,data){
    if (err){
      return "";
    }
    a = data;
  });
  var lat =  a.substring(a.indexOf(zip)+6,a.indexOf(zip)+14);
  var long = a.substring(a.indexOf(zip)+17,a.indexOf(zip)+26);
}
function getFindMeWeather(wc){
  var a = "";
  fs = require('fs');
  fs.readfile('wcdb','utf8',function(err,data){
    if (err){
      return "";
    }
    a = data;
  });
  var lat =  a.substring(a.indexOf(wc)+6,a.indexOf(wc)+14);
  var long = a.substring(a.indexOf(wc)+17,a.indexOf(wc)+26);
}
//html <p><button onclick="geoFindMe()">Get location from browser</button></p>
//html <form action = "getFindMeZip()"> Zip:
          //<input type = "text" name = "Zip:"><br>
          //<input type = "submit" value ="Get location from Zip">
//html <form action = "getFindMeWeather()"> WeatherCode:
          //<input type = "text" name = "WeatherCode:"<br>
          //<input  type = "submit" value ="Get location from Weathercode">

//<div id="out"></div>
