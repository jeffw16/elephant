var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('newQuestion', function(roomID, text){
    io.emit('newQuestion',roomID messageID, text);
  });

  socket.on('newRoom', function(roomID, name){
    io.emit('newRoom',roomID, name);
  });
});

const PORT = 80;
http.listen(PORT, function(){
  console.log('Staring Elephant Server on Port ' + PORT);
});
