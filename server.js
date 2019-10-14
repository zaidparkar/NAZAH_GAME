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


//Player class to store movement and angle
class Player{

    constructor(id)
    {
        this.id = id;
        this.isUpdated = false;
        Player.list[id] = this;
    }

    update(data)
    {
        this.x = data.x;
        this.y = data.y;
        this.angle = data.angle;
        this.isUpdated = true;
    }


}
Player.list ={};

// This is list all the sockets connected to the server
const socketList = {};

io.on('connection', (socket) => {

    //generates a socket id 
    socket.id = Math.random();
    console.log(socket.id);
    socket.emit('init', socket.id);
    //add socket in the list
    socketList[socket.id] = socket;

    let player = new Player(socket.id);

    socket.on('disconnect', () =>
    {
        io.emit('playerDisconnected', socket.id);
        delete socketList[socket.id];
        delete Player.list[socket.id];
    });

    //Sends a meesage to everyone stating a new player has joined
    io.emit("pl", "a new player has connected");

    //checks for the player data coming from 
    socket.on('playerData', (data)=> {
        player.update(data);
    })

});

//every 40ms the server updates the client of all the players
setInterval(()=> {
        let pack=[];
        for(let id in Player.list){
            player = Player.list[id];

            if(player.isUpdated)
            {
                pack.push({
                    id: player.id,
                    x: player.x,
                    y: player.y,
                    angle: player.angle
                });
                player.isUpdated = false;
            }
            
        }


        for(let id in socketList){
            socket = socketList[id];
            socket.emit("update", pack);
        }
    }, 1000/25
);





