// init socket.io
var socket = io();
var rooms = [];
var roomi, questioni;
roomi = 0;
questioni = 0;
var user = "Bob";
// get geodata
var lati, longi;
// Setup script on document load
$(function() {
  console.log("elephant client v0.2.0");
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

update_rooms_list();


socket.on('getLatitudeLongitudeFromZip', function( latitude, longitude ){
  lati = latitude;
  longi = longitude;
  console.log( "Latitude: " + latitude + ", Longitude: " + longitude );
});

socket.on('newRoom', function(room){
  //socket.emit('getRoomsInArea',lati, longi);
  socket.emit('isCloseEnoughToRoom', lati, longi, room.id, function(closeEnough, room2){
    console.log(closeEnough);
    if(closeEnough){
      rooms.push(room2);
      update_rooms_list();
    }
  });
});

socket.on('newTopic', function(roomID, topic){
  for(var i=0; i<rooms.length; i++){
    if(rooms[i].id == roomID){
      rooms[i].topics.push(topic);
      update_questions_list();
    }
  }
});

socket.on('newMessage', function(roomID, topicID, message){
  for(var i=0; i<rooms.length; i++){
    if(rooms[i].id == roomID){
      rooms[i].topics[topicID].messages.push(message);
      console.log(rooms[i].topics[topicID].messages.length);
      update_messages_list();
    }
  }
});



socket.on('getRoomsInArea', function( roomsInArea ){
  rooms_html_insert = "";
  questions_html_insert = "";
  rooms = roomsInArea;
  update_rooms_list();
  /*
  for ( i = 0; i < roomsInArea.length; i++ ) {
    rooms_html_insert += '<li role="presentation" class="rooms-item" id="room-' + roomsInArea[i].name + '"><a href="#">' + roomsInArea[i].name + '</a></li>';
  }
  $("#rooms-list").html(rooms_html_insert);
  $("#questions-list").html(questions_html_insert);
  */
});

function update_rooms_list() {
  rooms_html_insert = "";
  for (var i = 0; i < rooms.length; i++ ) {
    rooms_html_insert += '<li role="presentation" class="rooms-item" id="room-' + rooms[i].name + '"><a href="#">' + rooms[i].name + '</a></li>';
  }
  $("#rooms-list").html(rooms_html_insert);
}

function update_questions_list() {
  questions_html_insert = "";
  for (var j = 0; j < rooms[roomi].topics.length; j++ ) {
    questions_html_insert += '<li role="presentation" class="questions-item" id="question-' + rooms[roomi].topics[j].text + '"><a href="#">' + rooms[roomi].topics[j].text + '</a></li>';
  }
  $("#questions-list").html(questions_html_insert);
}

/*function update_messages_list() {
  messages_html_insert = "";
  console.log(questioni+" "+rooms[roomi].topics[questioni].messages.length);
  for (var j = 0; j < rooms[roomi].topics[questioni].messages.length; j++ ) {
    console.log("hoop");
    messages_html_insert += '<li role="presentation" class="answers-item" id="answer-' + rooms[roomi].topics[questioni].messages[j].text + '"><p>' + rooms[roomi].topics[questioni].messages[j].text + '</p></li>';
  }
  $("#answers-list").html(messages_html_insert);
}*/
function update_messages_list() {
  question_pane_html_insert = '<h2>' + rooms[roomi].topics[questioni].text + '</h2>';
  for ( j = 0; j < rooms[roomi].topics[questioni].messages.length; j++ ) {
    question_pane_html_insert += '<div class="well well-sm"><p>' + rooms[roomi].topics[questioni].messages[j].text + '</p></div>';
  }
  $("#question-pane").html(question_pane_html_insert);
}

socket.emit('getRoomsInArea', lati, longi );

//$(document).ready(function(){
  // Room selection
  $("#rooms-list").on('click','.rooms-item',function( event ){
    event.preventDefault();
    if ( !$(this).hasClass("rooms-item-active") ) {
      $(".rooms-item").each(function(index,el){
        if ( $(el).hasClass("rooms-item-active") ) {
          $(el).removeClass("rooms-item-active").removeClass("active");
        }
      });
      $(this).addClass("rooms-item-active").addClass("active");
    }
    //rooms[roomi].name = $(this).attr('id').substring(5);
    for ( i = 0; i < rooms.length; i++ ) {
      if ( rooms[i].name == $(this).attr('id').substring(5) ) {
        roomi = i;
        break;
      }
    }
    update_questions_list();
  });
//});

// Question selection
$("#questions-list").on('click','.questions-item',function( event ){
  if ( !$(this).hasClass("questions-item-active") ) {
    $(".questions-item").each(function(index,el){
      if ( $(el).hasClass("questions-item-active") ) {
        $(el).removeClass("questions-item-active").removeClass("active");
      }
    });
    $(this).addClass("questions-item-active").addClass("active");
    for ( k = 0; k < rooms[roomi].topics.length; k++ ) {
      console.log(rooms[roomi].topics[k].text + "- -" + $(this).attr('id').substring(9));
      if ( rooms[roomi].topics[k].text == $(this).attr('id').substring(9) ) {
        questioni = k;
        console.log("questioni set to " + questioni);
        console.log("" + questioni + " bc " + rooms[roomi].topics[k] + " and " + $(this).attr('id').substring(9));
        break;
      }
    }
    update_messages_list();
     // pull content for selected question into the pane
  }

});

// Asking a question
$("#ask-question").click(function(){
  $("#ask-question-modal").modal();
});
$("#ask-question-submit").click(function(){
  socket.emit('newTopic', rooms[roomi].id, user, $("#ask-question-content").val());
  $("#ask-question-modal").modal('hide');
});

// Writing an answer
$("#write-answer").click(function(){
  $("#write-answer-modal").modal();
});
$("#write-answer-submit").click(function(){
  console.log(questioni+":: "+ rooms[roomi].topics.length);
  socket.emit('newMessage', rooms[roomi].id, rooms[roomi].topics[questioni].id, user, $("#write-answer-content").val());
  $("#write-answer-modal").modal('hide');
});

// Creating a room
$("#create-room").click(function(){
  $("#create-room-modal").modal();
});
$("#create-room-submit").click(function(){
  socket.emit('newRoom', lati, longi, $("#create-room-name").val());
  $("#create-room-modal").modal('hide');
});
});
