var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

const viewRange = 1;

var Room = function(latitude, longitude, name){
	this.latitude = latitude;
	this.longitude = longitude;
	this.name = name;
	this.topics = [];
};

var Topic = function(user, text){
	this.user = user;
	this.text = text;
	this.messages = [];
}

var Message = function(user, text){
	this.user = user;
	this.text = text;
};

var rooms = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('newTopic', function(latitude, longitude, roomID, user, text){
  	createTopic(getRoomByID(roomID), user, text);
    io.emit('newTopic', roomID, messageID, user, text);
  });

  socket.on('newRoom', function(latitude, longitude, roomID, name){
  	createRoom(latitude,longitude,name);
    io.emit('newRoom',roomID, name);
  });

  socket.on('newMessage', function(latitude, longitude, roomID, topicID, user, text){
  	createMessage(getTopicByID(getRoomByID(roomID), topicID), user,text);
    io.emit('newMessage', topicID, user, text);
  });

	socket.on('getLatitudeLongitudeFromZip', function(zip){
  	var a = "";
  	fs.readfile('zipdb','utf8',function(err,data){
  		if (err){
  			return "";
  		}
  		a = data;
  	});
  	var latitude =  a.substring(a.indexOf(zip)+6,a.indexOf(zip)+14);
  	var longitude = a.substring(a.indexOf(zip)+17,a.indexOf(zip)+26);
    io.emit('getLatitudeLongitudeFromZip', latitude, longitude);
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

const PORT = 80;
http.listen(PORT, function(){
	console.log('elephant server v0.0.1');
  console.log('Starting on port ' + PORT);
});

function getRoomByID(id){
	return rooms[id];
}

function getTopicByID(room, id){
	return room.topics[id];
}

function createRoom(latitude, longitude, name){
  	var newRoom = new Room(latitude, longitude, name);
  	rooms.push(newRoom);
}

function createTopic(room, user, text){
	room.topics.push(new Topic(user, text));
}

function createMessage(topic, user, text){
	question.messages.push(new Message(user, text));
}
