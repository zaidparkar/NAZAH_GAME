
//The required module for the connection attempts
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/js/bundle.js');
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