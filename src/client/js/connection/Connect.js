import {Player} from '../model/Player'
import { Bullet } from '../model/Bullet';
import * as GameController from '../GameController';
const io = require('socket.io-client');


//Connects to the defined address
const socket = io.connect('https://gungalenazah.herokuapp.com/');


//self id for the player
export let isGameRunning = true;
export let isGameFull = false;
export let selfId = 1223;
//the player of the user
export let selfPlayer = null;
let team = 0;
//variable to sync in with the server
export let sync = false;
const syncTime = 4;
let syncTimer = 0;



export const createPlayer = (player) => {
    selfPlayer = player;
    if(selfPlayer)
        selfPlayer.team = team;
}

//-----------------------------------recieve----------------------------

socket.on('connect', (socketId) =>
{
    //testing
    console.log('connected');

});

//Create player with the socketId
socket.on('init', (socketId)=>
{
    selfId = socketId;
    console.log(socketId);
});

let isTeamSet = true;

socket.on('teamSet', (data) => {
    team = data;
    isTeamSet = true;
});

export const getTeamSet = ()=>{
    return isTeamSet;
}

export const setTeamSet = (value)=>{
    isTeamSet = value;
}




socket.on('objectiveUpdate', (data) =>{
    for(let i = 0; i < data.length; i ++)
    {
        let obj = data[i];
        GameController.objectives[obj.id].team0capture = obj.num0;
        GameController.objectives[obj.id].team1capture = obj.num1;
    }
})

socket.on('Scoreboard', (data) => {
    GameController.setDatabase(data);
});

socket.on('gameFinished', () => {
    isGameRunning = false;
});


socket.on("NopeJoin", () => {
    isGameFull = true;
});

socket.on('playerDied', (data) => {
    console.log('playerDied with the id'  + data);
    for(let i = 0; i < data.length; i++)
    {
        if(Player.list[data[i]] && data[i] != selfId)
        {
            Player.list[data[i]].die();
            delete Player.list[data[i]];
        }
    }
    
})



//update the player list
socket.on('update', (pack) =>
{
    isGameRunning = true;
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
            player.team = data.team;
        }
        //update the data of all the player
        if(player.id != selfId || !sync)
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

    for(let i = 0; i < pack.obj.length; i++)
    {
        GameController.objs[i].team0capture = pack.obj[i].cap0;
        GameController.objs[i].team1capture = pack.obj[i].cap1;
    }


    GameController.setTeam0Points(pack.teamPoints[0]);
    GameController.setTeam1Points(pack.teamPoints[1]);


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


//--------------------------check sign in ----------------------------

let SignedIn = false;

export const checkSignIn = () => {
    return SignedIn;
}

socket.on('signInPassed', () =>{
    console.log("passed");
    SignedIn = true;
});


let Registered = false;

export const checkRegester = () => {
    return Registered;
}

socket.on('registerPassed', () =>{
    console.log("passed");
    Registered = true;
});




//-----------------------------emit-----------------------------------

let emitSignIn = false;
let emitRegister = false;
let userName = "";
let password = "";
let email = "";

export const setEmitSignIn = (value) => 
{
    emitSignIn = value;
}

export const setSignInDetails = (name, pass) => {

    userName = name;
    password = pass;
}


export const setEmitRegister = (value) => 
{
    emitRegister = value;
}

export const setRegisterDetails = (name, pass) => {

    setSignInDetails(name, pass);
}

let emitSettingTeam = false;

export const setEmitTeam = (value) => 
{
    emitSettingTeam = value;
}




//send the player data to the server
setInterval(()=>{

    //sign in details
    if(isGameRunning)
    {

        if(emitRegister){
            emitRegister = false;
            socket.emit("registerDetails", {
                userName : userName,
                password : password
            })
        }


        if(emitSignIn){
            emitSignIn = false;
            socket.emit("signInDetails", {
                userName : userName,
                password: password
            })
        }

        if(emitSettingTeam)
        {
            emitSettingTeam = false;
            socket.emit("setTeam");
        }




        // game data
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
        
            if(selfPlayer.spawned)
            {
                socket.emit("spawned", {id: selfId ,team: selfPlayer.team });
                selfPlayer.spawned = false;
            }
            else{

                if(selfPlayer.changedObj)
                {
                    socket.emit("changedObj", selfPlayer.obj);
                    selfPlayer.changedObj = false;
                    selfPlayer.objTimer = 0;
                    //console.log("Connect 184 :: yes");
                }




                if(selfPlayer.isDead)
                {
                    console.log("i died");
                    socket.emit("dead", selfId);
                }else{
                    socket.emit("playerData", {
                        x : selfPlayer.x,
                        y : selfPlayer.y,
                        angle : selfPlayer.angle,
                    });
            
            
                    socket.emit("bulletData", bulletData);
                }
            }  
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
    }

}, 1000/25
);

//only use when testing

//selfPlayer = new Player(12223);

