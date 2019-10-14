import {Player} from '../model/Player'
const io = require('socket.io-client');


//Connects to the defined address
const socket = io.connect('http://localhost');


//Calls an anonymouse function when connected with the server
export let selfId;
export let player;
//Create player on connection
socket.on('connect', () =>
{
    // stores the id of the socket
    selfId = socket.id;
    player = new Player(selfId);
    //testing
    console.log('connected');
});

//send the player data to the server
setInterval(()=>{
        if(player)
        {
            socket.emit("playerData", {
                x : player.x,
                y : player.y,
                angle : player.angle
            });
        }
    }, 1000/25
);





