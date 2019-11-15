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
        this.team = 1;
        this.obj = null;
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
        this.hitId = data.hitId;
        if(this.hitId != null)
        {
            Player.list[this.hitId].health -=25;
        }
    }
}

class Obj{

    constructor(id)
    {
        this.id = id;
        this.capturedBy = null;
        this.capturingBy = null;
        this.team0 = 0;
        this.team1 = 0;
        this.team0capture = 0;
        this.team1capture = 0;
        this.sendCapture = false;
        this.isCapturing = false
    }

    capture()
    {
        this.isCapturing = true;
        // runs every second
        const main = setInterval( () =>{
            let num = Math.abs(this.team0 - this.team1);
            if(num > 6)
            {
                num = 6;
            }
    
    
            if(this.team0 > this.team1)
            {
                this.capturingBy = this.team0;
                this.team0capture += (2.5 * (num * 1));
                this.team1capture = -this.team0capture;
            }else if(this.team1 > this.team0)
            {
                this.capturingBy = this.team1;
                this.team1capture += (2.5 * (num * 1));
                this.team0capture = -this.team1capture;
            }
    
            //base case
            if(Math.abs(this.team0capture) + Math.abs(this.team1capture) > 200)
            {
                this.isCapturing = false;
                if(this.capturingBy == this.team0)
                {
                    this.team0capture = 100;
                }else{
                    this.team1capture = -100
                }

                clearInterval(main);
            }
            
            this.sendCapture = true;

        } , 1000);
        
    }
}


Player.list ={};
Bullet.list ={};


//Objective control

const numberOfObj = 3;

const objs = [];

for (let i = 0; i< numberOfObj; i++)
{
    objs.push(new Obj(i));
}



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
        //console.log(data.obj == null);
    });

    socket.on('changedTeam', (data) => {
        player.team = data;
        //console.log(player.team);
    })

    socket.on('changedObj', (data) => {
        if(data != -1)
        {
            if(player.team == 0)
            {
                objs[data].team0++;
            }else{
                objs[data].team1++;
            }

            if(!objs[data].isCapturing)
                objs[data].capture();
            
        }else{
            if(player.team == 0)
            {
                objs[player.obj].team0--;
            }else{
                objs[player.obj].team1--;
            }
            if(!objs[player.obj].isCapturing)
                objs[player.obj].capture();

        }
        player.obj = data;
        
    })


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
                    angle: player.angle,
                    health: player.health
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


        const sendObj= [];
        for(let i = 0; i < objs.length; i++)
        {
            if(objs[i].sendCapture)
            {
                sendObj.push({
                    id: objs[i].id,
                    num0: objs[i].team0capture,
                    num1: objs[i].team1capture
                });
                objs[i].sendCapture = false;
            }
        }
 




        for(let id in socketList){
            socket = socketList[id];
            socket.emit("update", pack);
            if(sendObj.length > 0)
            {
                socket.emit("objectiveUpdate", sendObj);
                console.log('sending objective');
            }

            
        }

        
    }, 1000/25
);





