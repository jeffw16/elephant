// init socket.io
var socket = io();

// Setup script on document load
$(function() {
  console.log("elephant client v0.0.1");
  /*
  // get geodata
  if ("geolocation" in navigator) {
    // geolocation is available
    console.log("Geolocation available.");
    navigator.geolocation.getCurrentPosition(function(position) {
      alert(position.coords.latitude + " " + position.coords.longitude);
    });
  } else {
    // geolocation IS NOT available
    console.log("Geolocation not available.");
  }
  */
  // store/check cookie in zip code
  var zip = document.cookie.replace(/(?:(?:^|.*;\s*)elephant_zipcode\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if ( zip == undefined || zip == null || zip == "" ) {
    givenzip = prompt("What is your zip code?");
    document.cookie = "elephant_zipcode=" + givenzip;
    console.log("Zip code stored as " + givenzip);
  } else {
    console.log("Retrieving stored zip " + zip);
  }
  // send geodata, pull stuff from server
  socket.emit('getLatLongFromZip', zip);
});

// get geodata
var lati, longi;
socket.on('getLatLongFromZip', function( latitude, longitude ){
  lati = latitude;
  longi = longitude;
  console.log( "Latitude: " + latitude + ", Longitude: " + longitude );
  socket.emit('getRoomsInArea', latitude, longitude );
});

// Room selection
$(".rooms-item").click(function(){
  if ( !$(this).hasClass("rooms-item-active") ) {
    $(".rooms-item").each(function(index,el){
      if ( $(el).hasClass("rooms-item-active") ) {
        $(el).removeClass("rooms-item-active").removeClass("active");
      }
    });
    $(this).addClass("rooms-item-active").addClass("active");
  }
});

// Question selection
$(".questions-item").click(function(){
  if ( !$(this).hasClass("questions-item-active") ) {
    $(".questions-item").each(function(index,el){
      if ( $(el).hasClass("questions-item-active") ) {
        $(el).removeClass("questions-item-active").removeClass("active");
      }
    });
    $(this).addClass("questions-item-active").addClass("active");
  }
  // pull content for selected question into the pane
  $("#question-pane").html("<p>hi</p>");
});
