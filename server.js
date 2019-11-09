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
class Entity{

    constructor(id)
    {
        this.id = id;
        this.isUpdated = false;

    }

    update(data)
    {
        this.x = data.x;
        this.y = data.y;
        this.angle = data.angle;
        this.isUpdated = true;
    }


}

class Player extends Entity{

    constructor(id)
    {
        super(id);
        Player.list[id] = this;
        this.health = 100;
    }
}

//Bullet class to store the info of the Bullet
class Bullet extends Entity{

    constructor(id,playerId)
    {
        super(id);
        this.playerId = playerId;
        Bullet.list[this.id] = this;
    }

    update(data){
        super.update(data);
        this.destroyed = data.destroyed;
    }
}



Player.list ={};
Bullet.list ={};
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
    });

    socket.on('bulletData', (data) => {
        

        for(let i = 0; i < data.length; i++)
        {
            const bullet = data[i];

                let b = null;
                if(Bullet.list[bullet.id])
                {
                    b = Bullet.list[bullet.id];
                }else{
                    b = new Bullet(bullet.id, player.id);
                }
                b.update(bullet);            

        }
        
    })

});

//every 40ms the server updates the client of all the players
setInterval(()=> {
        let pack={
            player:[],
            bullet:[]
        };
        for(let id in Player.list){
            const player = Player.list[id];

            if(player.isUpdated)
            {
                pack.player.push({
                    id: player.id,
                    x: player.x,
                    y: player.y,
                    angle: player.angle
                });
                player.isUpdated = false;
            }
            
        }

        for(let id in Bullet.list)
        {
            const bullet =  Bullet.list[id];

            if(bullet.destroyed)
            {
                pack.bullet.push({
                    id: bullet.id,
                    playerId:bullet.playerId,
                    destroyed:true
                });
                delete Bullet.list[id];
            }else{
                if(bullet.isUpdated)
                {
                    pack.bullet.push({
                        id: bullet.id,
                        x: bullet.x,
                        y: bullet.y,
                        angle: bullet.angle,
                        playerId: bullet.playerId,
                        destroyed: bullet.destroyed
                    });
                    bullet.isUpdated = false;
                }
            }
        }


        for(let id in socketList){
            socket = socketList[id];
            socket.emit("update", pack);
        }
    }, 1000/25
);





