const VERSION = '0.0.1';
const PORT = 80;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

const viewRange = 1;

var Room = function(latitude, longitude, name, id){
	this.latitude = latitude;
	this.longitude = longitude;
	this.name = name;
  this.id = id;
	this.topics = [];
};

var Topic = function(user, text, id){
  this.id = id;
	this.user = user;
	this.text = text;
	this.messages = [];
}

var Message = function(user, text, id){
  this.id = id;
	this.user = user;
	this.text = text;
};

var rooms = [];
app.use(express.static('client'));
app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/client/'+req);

});

io.on('connection', function(socket){

  socket.on('newTopic', function(roomID, user, text){
  	var topic = createTopic(getRoomByID(roomID), user, text);
    io.emit('newTopic', roomID, topic);
  });

  socket.on('newRoom', function(latitude, longitude, name){
  	var room = createRoom(latitude,longitude,name);
    io.emit('newRoom',room);
  });

  socket.on('newMessage', function(roomID, topicID, user, text){
    console.log(roomID+" "+topicID);
  	var message = createMessage(getTopicByID(getRoomByID(roomID), topicID), user,text);
    io.emit('newMessage', roomID, topicID, message);
  });

	socket.on('getLatitudeLongitudeFromZip', function(zip){
  	var a = "";
  	fs.readFile('zipdb','utf8',function(err,data){
  		if (err){
  			return "";
  		}
  		a = data;
  	});
  	var latitude =  a.substring(a.indexOf(zip)+6,a.indexOf(zip)+14);
  	var longitude = a.substring(a.indexOf(zip)+17,a.indexOf(zip)+26);
    latitude = 0;
    longitude = 0;
    console.log(latitude+" "+longitude);

    io.emit('getLatitudeLongitudeFromZip', latitude, longitude);
  });

  socket.on('isCloseEnoughToRoom', function(latitude, longitude, roomID, callback){
    var room = getRoomByID(roomID);
    if(Math.abs(latitude-room.latitude)+Math.abs(longitude-room.longitude)<=viewRange){
      callback(true,room);
    }else{
      callback(false, null);
    }
  }); 

  socket.on('getRoom', function(roomID, callback){
    callback(getRoomByID(roomID));
  });

  socket.on('getRoomsInArea', function(latitude, longitude){
    var roomsInArea = [];
    for(var i = 0; i<rooms.length; i++){
      var r = rooms[i];
      var distance = Math.abs(latitude-r.latitude) + Math.abs(longitude-r.longitude);
      if(distance<=viewRange){
        roomsInArea.push(r);
      }
    }
    socket.emit('getRoomsInArea', roomsInArea);
  });
});

http.listen(PORT, function(){
	console.log('elephant server '+ VERSION);
  console.log('Starting on port ' + PORT);
});

function getRoomByID(id){
	return rooms[id];
}

function getTopicByID(room, id){
	return room.topics[id];
}

function createRoom(latitude, longitude, name){
  console.log("Creating Room "+ name +" at "+latitude+" "+longitude);
  	var room = new Room(latitude, longitude, name, rooms.length);
    room.topics = [];
  	rooms.push(room);
    return room;
}

function createTopic(room, user, text){
  var topic = new Topic(user, text, room.topics.length);
	room.topics.push(topic);
  topic.messages = [];
  return topic;
}

function createMessage(topic, user, text){
  var message = new Message(user, text, topic.messages.length);
	topic.messages.push(message);
  return message;
}
