import {Player} from '../model/Player'
import { Bullet } from '../model/Bullet';
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


//-----------------------------------recieve----------------------------

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

    for(const i in pack.player){
        //get data on one user
        let data = pack.player[i];

        let player;

        //check if the player is new or not
        if(Player.list[data.id] != null)
        {
            //console.log("Boring, its the same old player");
            player = Player.list[data.id];
        }else{
            //console.log("yahoo, new player");
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
    for(const i in pack.bullet){
        //get data on one user
        let data = pack.bullet[i];

        let bullet;

        //check if the Bullet is new or not
        if(data.destroyed)
        {
            //delete the bullet if the bullet is destroyed
            delete Bullet.list[data.id];
        }else{

            //if null create one
            //else select the exixting one
            if(Bullet.list[data.id] != null)
            {
                bullet = Bullet.list[data.id];
            }else{

                bullet = new Bullet(data.id);
            }
            //update the data of all the player
            if(bullet.playerId != selfPlayer.id || !sync)
            {
                bullet.x = data.x;
                bullet.y = data.y;
                bullet.angle = data.angle;
            }

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
    Player.list[socketId].clearGrid();
    delete Player.list[socketId];
});




//-----------------------------emit-----------------------------------



//send the player data to the server
setInterval(()=>{

    const bulletData = [];
    
    for (const i in Player.bulletList)
    {
        const bullet = Player.bulletList[i];

        const destroyed = bullet.destroyed;
        //add the required data into the list
        bulletData.push({
            id: bullet.id,
            x: bullet.x,
            y: bullet.y,
            angle: bullet.angle,
            destroyed: destroyed
        });

        if(destroyed){
            console.log("destroyed confirmed");
            delete Player.bulletList[i];
        }
    }

    //if the player is available then send the data
    //emits bulletData
    if(selfPlayer)
    {
        socket.emit("playerData", {
            x : selfPlayer.x,
            y : selfPlayer.y,
            angle : selfPlayer.angle
        });

        socket.emit("bulletData", bulletData);
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

