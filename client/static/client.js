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
  socket.emit('getLatitudeLongitudeFromZip', zip);
});

// get geodata
var lati, longi;
socket.on('getLatitudeLongitudeFromZip', function( latitude, longitude ){
  lati = latitude;
  longi = longitude;
  console.log( "Latitude: " + latitude + ", Longitude: " + longitude );
  socket.emit('getRoomsInArea', latitude, longitude );
});

var rooms, currentroom, currentquestion;
socket.on('getRoomsInArea', function( roomsInArea ){
  rooms_html_insert = "";
  questions_html_insert = "";
  rooms = roomsInArea;
  for ( i = 0; i < roomsInArea.length; i++ ) {
    rooms_html_insert += '<li role="presentation" class="rooms-item" id="room-' + roomsInArea[i].name + '"><a href="#">' + roomsInArea[i].name + '</a></li>';
    for ( j = 0; i < roomsInArea[i].length; j++ ) {
      questions_html_insert += '<li role="presentation" class="questions-item" id="question-' + roomsInArea[i].topics[j].text + '"><a href="#">' + roomsInArea[i].topics[j].text + '</a></li>';
    }
  }
  $("#rooms-list").html(rooms_html_insert);
  $("#questions-list").html(questions_html_insert);
});

function update_questions_list() {
  for ( j = 0; i < currentroom.topics.length; j++ ) {
    questions_html_insert += '<li role="presentation" class="questions-item" id="question-' + currentroom.topics[j].text + '"><a href="#">' + currentroom.topics[j].text + '</a></li>';
  }
  $("#questions-list").html(questions_html_insert);
}

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
  currentroom_name = $(this).attr('id').substring(5);
  for ( i = 0; i < rooms.length; i++ ) {
    if ( rooms[i].name == currentroom_name ) {
      currentroom = rooms[i];
      break;
    }
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
  currentquestion_name = $(this).attr('id').substring(9);
  for ( i = 0; i < currentroom.topics.length; i++ ) {
    if ( currentroom.topics[i].text == currentquestion_name ) {
      currentquestion = currentroom.topics[i];
      break;
    }
  }
  question_pane_html_insert = '<h2>' + currentquestion_name + '</h2>';
  for ( j = 0; j < currentquestion.messages.length; j++ ) {
    question_pane_html_insert += '<div class="well"><p>' + currentquestion.messages[j].text + '</p></div>';
  }
  $("#question-pane").html(question_pane_html_insert);
});

// Asking a question
$("#ask-question").click(function(){
  $("#ask-question-modal").modal();
});
$("#ask-question-submit").click(function(){
  socket.emit('newTopic', lati, longi, currentroom_name, user, $("#ask-question-content").val());
});

// Writing an answer
$("#write-answer").click(function(){
  $("#write-answer-modal").modal();
});
$("#write-answer-submit").click(function(){
  socket.emit('newMessage', lati, longi, currentroom_name, currentquestion_name, user, $("#write-answer-content").val());
});

// Creating a room
$("#create-room").click(function(){
  $("#create-room-modal").modal();
});
$("#create-room-submit").click(function(){
  socket.emit('newRoom', lati, longi, $("#create-room-name").val(), $("#create-room-name").val());
})
