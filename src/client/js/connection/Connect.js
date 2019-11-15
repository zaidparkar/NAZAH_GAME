import {Player} from '../model/Player'
import { Bullet } from '../model/Bullet';
import * as GameController from '../GameController';
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

socket.on('objectiveUpdate', (data) =>{
    for(let i = 0; i < data.length; i ++)
    {
        let obj = data[i];
        GameController.objectives[obj.id].team0capture = obj.num0;
        GameController.objectives[obj.id].team1capture = obj.num1;
    }
})




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
        player.health = data.health;
        
    }
    for(const i in pack.bullet){
        //get data on one user
        let data = pack.bullet[i];

        let bullet;

        //check if the Bullet is new or not
        if(data.destroyed)
        {
            //delete the bullet if the bullet is destroyed
            if(Bullet.list[data.id])
            {
                delete Bullet.list[data.id];
            }
        }else{

            //update the data of all the player
            if(data.playerId != selfPlayer.id || !sync)
            {

                //if null create one
                //else select the exixting one
                if(Bullet.list[data.id] != null)
                {
                    bullet = Bullet.list[data.id];
                }else{

                    bullet = new Bullet(data.id);
                }

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

        //add the required data into the list
        bulletData.push({
            id: bullet.id,
            x: bullet.x,
            y: bullet.y,
            angle: bullet.angle,
            destroyed: bullet.destroyed,
            hitId: bullet.hitId
        });

        if(bullet.destroyed){
            delete Player.bulletList[i];
        }
    }

    //if the player is available then send the data
    //emits bulletData
    if(selfPlayer)
    {
     
        if(selfPlayer.changedTeam)
        {
            socket.emit("changedTeam", selfPlayer.team);
            //console.log("connect: changedTeam sent");

            selfPlayer.changedTeam = false;
        }

        if(selfPlayer.changedObj)
        {
            socket.emit("changedObj", selfPlayer.obj);
            selfPlayer.changedObj = false;
            selfPlayer.objTimer = 0;
            console.log("Connect 184 :: yes");
        }

        socket.emit("playerData", {
            x : selfPlayer.x,
            y : selfPlayer.y,
            angle : selfPlayer.angle,
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

