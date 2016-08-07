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
function setGeo(){
  var lat = 0;
  var long = 0;
}
//html <p><button onclick="geoFindMe()">Get location from browser</button></p>
//html <form action = "getFindMeZip()"> Zip:
          //<input type = "text" name = "Zip:"><br>
          //<input type = "submit" value ="Get location from Zip">
          //</form>
//html <form action = "setGeo()">Set Longitude and Latitude
          //<input type = "text" name = "Longitude:"><br>
          //<input type = "text" name = "Latitude:"><br>
          //<input type = "submit" value = "Submit Location">
          //</form>
//<div id="out"></div>
