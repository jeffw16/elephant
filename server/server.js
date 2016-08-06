var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const viewRange = 1;

var Room = function(lat, long, name){
	this.lat = lat;
	this.long = long;
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
  socket.on('newTopic', function(lat, long, roomID, user, text){
  	createTopic(getRoomByID(roomID), user, text);
    io.emit('newTopic', roomID, messageID, user, text);
  });

  socket.on('newRoom', function(lat, long, roomID, name){
  	createRoom(lat,long,name);
    io.emit('newRoom',roomID, name);
  });

  socket.on('newMessage', function(lat, long, roomID, topicID, user, text){
  	createMessage(getTopicByID(getRoomByID(roomID), topicID), user,text);
    //var ret = JSON.parse('{"ret:[{user:'+user+'},{}]}"');
    io.emit('newMessage', topicID, user, text);
  });

  socket.on('getRoomsInArea', function(lat, long){
    var roomsInArea = [];
    for(var i = 0; i<rooms.length; i++){
      var r = rooms[i];
      var distance = Math.abs(lat-r.lat) + Math.abs(long-r.long);
      if(distance<=viewRange){
        roomsInArea.push(r);
      }
    }
    socket.emit('newMessage', roomsInArea);
  });
});

const PORT = 80;
http.listen(PORT, function(){
  console.log('Staring Elephant Server on Port ' + PORT);
});

function getRoomByID(id){
	return rooms[id];
}

function getTopicByID(room, id){
	return room.topics[id];
}

function createRoom(lat, long, name){
  	var newRoom = new Room(lat, long, name);
  	rooms.push(newRoom);
}

function createTopic(room, user, text){
	room.topics.push(new Topic(user, text));
}

function createMessage(topic, user, text){
	question.messages.push(new Message(user, text));
}
