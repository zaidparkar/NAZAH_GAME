import {Player} from './model/Player';
import * as playerView from './views/playerView';
import * as base from './views/base';
import {getControl} from './Control';



//Creates a new player
//a random id is given for testing purposes
//in the future the server will give each player an unique Id
const player = new Player(1223);




const Update = () =>{

    //gets the context of the canvas
    //clears it
    base.elements.ctxMain.clearRect(0,0,500,500);

    //get the input controls
    const controls = getControl(player);

    // updates movement and the angle
    player.update(controls.movement, controls.angle);

    

    //draws the player in the canvas
    playerView.drawPlayer(player, base.elements.ctxMain);

}

//runs the interval in 25 fps
setInterval(Update , 1000/25);




