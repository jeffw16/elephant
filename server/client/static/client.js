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
    socket.emit('getLatitudeLongitudeFromZip', givenzip);
  } else {
    console.log("Retrieving stored zip " + zip);
    socket.emit('getLatitudeLongitudeFromZip', zip);
  }
  // send geodata, pull stuff from server

update_rooms_list();


socket.on('getLatitudeLongitudeFromZip', function( latitude, longitude ){
  lati = latitude;
  longi = longitude;
  console.log( "Latitude: " + latitude + ", Longitude: " + longitude );
  socket.emit('getRoomsInArea', lati, longi );
  console.log("Retrieving all rooms in area.");
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

socket.on('getSuggestion', function ( suggestion ){
  $("#suggestion-display").html('Did you mean: <a href="javascript:$(\'#ask-question-modal\').modal("hide");$(\'#question-' + suggestion + '\');">' + suggestion + '</a>');
});

function update_rooms_list() {
  rooms_html_insert = "";
  for (var i = 0; i < rooms.length; i++ ) {
    rooms_html_insert += '<li role="presentation" class="rooms-item" id="room-' + rooms[i].name + '"><a href="#">' + rooms[i].name + '</a></li>';
  }
  if ( rooms.length == 0 ) {
    rooms_html_insert = '<div class="alert alert-elephant"><p><i>No rooms yet!</i> Simply press the "Create a room" button above to create a room.</p></div>';
  }
  $("#rooms-list").html(rooms_html_insert);
}

function update_questions_list() {
  questions_html_insert = "";
  for (var j = 0; j < rooms[roomi].topics.length; j++ ) {
    questions_html_insert += '<li role="presentation" class="questions-item" id="question-' + rooms[roomi].topics[j].text + '"><a href="#">' + rooms[roomi].topics[j].text + '</a></li>';
  }
  if ( rooms[roomi].topics.length == 0 ) {
    questions_html_insert = '<div class="alert alert-elephant"><p><i>No questions yet!</i> Simply press the "Ask a question" button to begin asking your first question.</p></div>';
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
  question_pane_html_insert = '<h2 class="question-text">' + rooms[roomi].topics[questioni].text + '</h2>';
  for ( j = 0; j < rooms[roomi].topics[questioni].messages.length; j++ ) {
    question_pane_html_insert += '<div class="well well-sm answer-well"><p class="answer-text">' + rooms[roomi].topics[questioni].messages[j].text + '</p></div>';
  }
  if ( rooms[roomi].topics[questioni].messages.length == 0 ) {
    question_pane_html_insert = '<div class="alert alert-elephant"><p><i>No answers here yet!</i> Want to help answer? Simply press the "Write an answer" button above to share your knowledge.</p></div>';
  }
  $("#question-pane").html(question_pane_html_insert);
}


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
  suggestionsTimer();
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

var lastState, currState;
function suggestionsTimer() {
  currState = $("#ask-question-content").val();
  if ( lastState != null && lastState == currState ) {
    socket.emit('wantSuggestion', $("#write-answer-content").val());
  }
  lastState = currState;
  setTimeout(2000); //ms
  suggestionsTimer();
}
