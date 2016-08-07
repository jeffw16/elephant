const VERSION = '0.0.1';
const PORT = 80;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'w.chompfish.xyz',
    user     : 'myuser',
    password : 'mypass',
    database : 'elephant_testing',
    debug    :  false
});

const viewRange = 1;

var Room = function(latitude, longitude, name, id){
	this.latitude = latitude;
	this.longitude = longitude;
	this.name = name;
  this.id = id;
	this.topics = [];
};

var Topic = function(user, text, roomID, id){
  this.id = id;
	this.user = user;
	this.text = text;
  this.roomID = roomID;
	this.messages = [];
}

var Message = function(user, text, roomID, topicID, id){
  this.id = id;
  this.roomID = roomID;
  this.topicID = topicID;
	this.user = user;
	this.text = text;
};

var rooms = [];


function sendQuery(data, callback) {

    pool.getConnection(function(err,connection){
        if (err) {
          console.log('Cannot connect');
          return;
        }

        console.log('connected as id ' + connection.threadId);
        console.log(data);
        connection.query(data, function(err,rows){
            connection.release();
            if(!err) {
              //console.log(rows);
              callback(rows);
            }else{
              console.log("Error");
            }
        });
  });
}


function loadFromDataBase(){
  var row;
  sendQuery("SELECT * from Rooms", function(data){
    row = data;
    objs = JSON.parse(JSON.stringify(row));


    for(var i=0; i<objs.length; i++){
      room = new Room(objs[i].latitude, objs[i].longitude, objs[i].name, objs[i].id);
      rooms.push(room);
    }


          sendQuery("SELECT * from Topics", function(data){
    row = data;
    objs = JSON.parse(JSON.stringify(row));
        for(var i=0; i<objs.length; i++){
      topic = new Topic(objs[i].user, objs[i].text, objs[i].roomID, objs[i].id);
      room[objs[i].roomID].topics.push(room);
    }

  sendQuery("SELECT * from Messages", function(data){
    row = data;
    objs = JSON.parse(JSON.stringify(row));

    for(var i=0; i<objs.length; i++){
      message = new Message(objs[i].user, objs[i].text, objs[i].roomID, objs[i].topicID, objs[i].id);
      room[objs[i].roomID].topics[objs[i].topicID].messages.push(messsage);
    }



  });


  });

  });
}

loadFromDataBase();

app.use(express.static('client'));
app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/client/'+req);

});

io.on('connection', function(socket){

  socket.on('newRoom', function(latitude, longitude, name){
    var room = createRoom(latitude,longitude,name);
    io.emit('newRoom',room);
  });

  socket.on('newTopic', function(roomID, user, text){
  	var topic = createTopic(getRoomByID(roomID), user, text);
    io.emit('newTopic', roomID, topic);
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
    sendQuery("INSERT INTO Rooms values(" + latitude + ", " + longitude + ", '" + name + "', " + rooms.length + ")", function(e){});
    room.topics = [];
  	rooms.push(room);
    return room;
}

function createTopic(room, user, text){
  var topic = new Topic(user, text, room.id, room.topics.length);
      sendQuery("INSERT INTO Topics values( '" + user + "', '" + text + "', " + room.id + ", " + room.topics.length + ")", function(e){});
	room.topics.push(topic);
  topic.messages = [];
  return topic;
}

function createMessage(topic, user, text){
  var message = new Message(user, text, topic.roomID, topic.id, topic.messages.length);
      sendQuery("INSERT INTO Messages values( '" + user + "', '" + text + "', " + topic.roomID + ", " + topic.id + ", " + topic.messages.length + ")", function(e){});
	topic.messages.push(message);
  return message;
}
