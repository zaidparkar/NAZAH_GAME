import {Player} from '../model/Player'
const io = require('socket.io-client');


//Connects to the defined address
const socket = io.connect('http://localhost');


//self id for the player
export let selfId;
//the player of the user
export let selfPlayer;
//variable to sync in with the server
export let sync = false;
const syncTime = 4;
let syncTimer = 0;




socket.on('connect', (socketId) =>
{
    //testing
    console.log('connected');
});





//Create player with the socketId
socket.on('init', (socketId)=>
{
    selfPlayer = new Player(socketId);
    console.log(socketId);
});




//update the player list
socket.on('update', (pack) =>
{
    for(const i in pack){
        //get data on one user
        let data = pack[i];

        let player;

        //check if the player is new or not
        if(Player.list[data.id] != null)
        {
            console.log("Boring, its the same old player");
            player = Player.list[data.id];
        }else{
            console.log("yahoo, new player");
            player = new Player(data.id);
        }
        //update the data of all the player
        if(player != selfPlayer || !sync)
        {
            player.x = data.x;
            player.y = data.y;
            player.angle = data.angle;
        }
    }
    sync = true;
    syncTimer = 0;
});


//If a player disconnects
//the id of the player is recieved
//we delete the player
socket.on('playerDisconnected', (socketId) =>
{
    delete Player.list[socketId];
});








//send the player data to the server
setInterval(()=>{
    //if the player is available then send the data
    if(selfPlayer)
    {
        socket.emit("playerData", {
            x : selfPlayer.x,
            y : selfPlayer.y,
            angle : selfPlayer.angle
        });
    }

    //checks if the game is in sync with the server
    if(sync)
    {
        syncTimer++;
        if(syncTimer > syncTime)
        {
            sync = false;
            syncTimer = 0;
        }
    }

}, 1000/25
);

//only use when testing

selfPlayer = new Player(12223);





