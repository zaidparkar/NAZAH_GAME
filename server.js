//The required module for the connection attempts
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

//Sends the 'dist' folder to server
app.use('/', express.static(__dirname + '/dist'));

//sends the index.html file in the dist folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});


//testing
class Player{

    constructor(id)
    {
        this.id = id;
    }

    update(movement, angle)
    {
        this.x = movement.x;
        this.y = movement.y;
        this.angle = movement.angle;
    }
}

// testing 
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});