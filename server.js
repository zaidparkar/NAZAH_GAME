//The required module for the connection attempts
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var mysql = require('mysql');

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

//Sends the 'dist' folder to server
app.use('/', express.static(__dirname + '/dist'));

//sends the index.html file in the dist folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});


let team0points = 0;
let team1points = 0;
let isGameFinished = false;

//..................database....................//





var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'players'
});


con.connect(function(err) {
 if (err) 
    throw err;
 console.log("Connected!");
});


const addPlayer=(id, pass) =>{
    con.query('INSERT INTO users VALUES ("'+id+'","'+pass+'")',function(err){
            if (err) throw err;
        });
}


const UpdateKill=(id)=>{
con.query('UPDATE ScoreBoard SET Kills=Kills+1 where id = '+'"'+id+'"',function(err){
  if (err) throw err;
  });
}

const getKillsTemp = (id)=>{
    return new Promise((resolve, reject) => { 
        con.query('SELECT Kills from ScoreBoard where id='+'"'+id+'"',(err,res)=>{
        if (err)
            reject(err);
        if(res[0].Kills)
            resolve(res[0].Kills);  

        });
    });
};

const UpdateDeaths = (id) =>{
  con.query('UPDATE ScoreBoard SET Deaths=Deaths + 1 where id = '+'"'+id+'"',function(err){
    if (err) throw err;
    });
}


 const getDeathsTemp = (id)=>{
    return new Promise((resolve, reject) => { 
            con.query('SELECT Deaths from ScoreBoard where id='+'"'+id+'"',(err,res)=>{
            if (err)
                reject(err);
            if(res[0].Deaths)
                resolve(res[0].Deaths);  
            
        });
    });
};

const UpdateScore = (Score,id) =>{
  con.query('UPDATE ScoreBoard SET Points = '+Score+' where id='+'"'+id+'"' ,function(err){
    if (err) throw err;
    });
  }


 const getScoreTemp = (id)=>{
    return new Promise((resolve, reject) => { con.query('SELECT Points from ScoreBoard where id="'+id +'"',(err,res)=>{
      if (err)
        reject(err);
                               
      resolve(res[0].Points);  
      
    });
  });
};

const getUsernameTemp = (id)=>{
  return new Promise((resolve, reject) => { con.query('SELECT "'+id+ '" from users',(err,res)=>{
    if (err)
      reject(err);

    resolve(res);  
    
  });
});
};


const getPasswordTemp = (id)=>{
    return new Promise((resolve, reject) => { con.query('SELECT Password from users where id="'+id+'"',(err,res)=>{
            if (err)
                reject(err);
            resolve(res[0].Password);  
            
        });
    });
};
 const getScore=(id)=>{
  getScoreTemp("aditya").then((res) => {
    console.log(res);
  });
};  

  const getDeaths=(id)=>{
  getDeathsTemp("aditya").then((res) =>{
    console.log(res);
  });
};

  const getKills=(id)=>{
  getKillsTemp(id).then((res) =>{
    console.log(res);
  });
};

  const getUsername=(id)=>{
  getUsernameTemp("adt6").then((res) =>{
    console.log(res);
  });
};

 const getPassword= (id)=>{
   getPasswordTemp(id).then((res) =>{
    console.log(res+ " from the get password function");
    return res;
  });
};




  


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
        this.obj = -1;
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
            if(Player.list[this.hitId].team != Player.list[this.playerId].team)
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

const PlayerDied = [];

// This is list all the sockets connected to the server
const socketList = {};

io.on('connection', (socket) => {

    //generates a socket id 
    socket.id = Math.random();
    console.log(socket.id);
    socket.emit('init', socket.id);
    //add socket in the list
    socketList[socket.id] = socket;
    let team = 0;

    //sign in details

    socket.on("signInDetails", (data) => {
        let pass = "";
        getPasswordTemp(data.userName).then(res => {
            pass = res;
            }
        );
        
        setTimeout(() => {
            if(pass == data.password)
            {
                socket.emit("signInPassed");
                console.log("Passed");
            }else
            {
                console.log("nooooooooo");
            }
        }, 500);
        
    });


    //registrationDetails
    socket.on("registerDetails", (data) => {
        try {
            addPlayer(data.userName, data.password)
            setTimeout(() => {
                socket.emit("registerPassed");
            }, 500);
        } catch (error) {
            socket.emit("registerFailed")
        }
        
        
    });



    //game details
    let player;

    socket.on('setTeam', () => {
        let team0 = 0;
        let team1 = 0;
        for(let id in Player.list){

            each = Player.list[id];
            if(each.team == 0)
            {
                team0++;
            }else{
                team1++;
            }
        }
        console.log(team0);
        console.log(team1);

        if(team0 <= team1)
        {
            team = 0;
        }else{
            team = 1;
        }

        socket.emit('teamSet', team);

    })
    socket.on('spawned', (data) => {
        player = new Player(socket.id);
        player.team = team;
        console.log(player.team);
    });


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

    socket.on('changedObj', (data) => {
        if(data != -1 && data != 255)
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
            if(player.obj != -1)
            {
                if(player.team == 0)
                {
                    objs[player.obj].team0--;
                }else{
                    objs[player.obj].team1--;
                }
                if(!objs[player.obj].isCapturing)
                    objs[player.obj].capture();
            }
        }
        player.obj = data;
        
    });

    socket.on('dead', (id) => {
        //io.emit('playerDied', id);

        //console.log('Ooooh ooooh pLyaer died yeayreyy');
        if(Player.list[id].team == 0)
        {
            team1points++;
        }else {
            team0points++;
        }
        PlayerDied.push(id);
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

let updateInterval;
let emitInterval;
const gameFinish = () => {
    //do something
    isGameFinished = true;
    clearInterval(updateInterval);
    clearInterval(emitInterval);
}


const updateGameLoop =  () => {

    updateInterval = setInterval(() => {
        for (let i = 0; i < objs.length; i++)
        {
            const obj = objs[i];
            if(obj.team0capture == 100)
            {
                team0points += 1/35;

            }else if(obj.team1capture == 100 )
            {
                team1points += 1/35;
            }
        }
        team0points += 1/35;
        team1points += 1/35;

        if(team0points >= 1000 || team1points >= 1000)
        {
            gameFinish();
            clearInterval(interval);
        }

    }, 1000/25)
    
}


const startEmiting = () => {

    //every 40ms the server updates the client of all the players
    emitInterval = setInterval(()=> {
        let pack={
            player:[],
            bullet:[],
            obj:[],
            teamPoints:[]
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
                    health: player.health,
                    team: player.team
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
        for(let i = 0; i < objs.length; i++)
        {
            pack.obj.push(
                {
                    id: objs[i].id,
                    cap0: objs[i].team0capture,
                    cap1: objs[i].team1capture
                }
            );
        }
        pack.teamPoints.push(team0points);
        pack.teamPoints.push(team1points);



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
            /*if(sendObj.length > 0)
            {
                socket.emit("objectiveUpdate", sendObj);
                console.log('sending objective');
            }*/
            if(PlayerDied.length > 0)
            {
                socket.emit("playerDied", PlayerDied);
            }
        }

        if(PlayerDied.length > 0)
        {
            for(let i = 0; i < PlayerDied.length; i++)
            {
                delete Player.list[PlayerDied[i]];
            }
            PlayerDied.splice(0, PlayerDied.length);
        }

        
    }, 1000/25);
}



startEmiting();
updateGameLoop();





