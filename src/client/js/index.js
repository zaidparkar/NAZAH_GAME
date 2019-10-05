import {Player} from './model/Player';
import * as playerView from './views/playerView';
import * as base from './views/base';
import {getControl} from './Control';

const player = new Player(1223);




const Update = () =>{

    base.elements.ctxMain.clearRect(0,0,500,500);
    const controls = getControl(player);
    player.update(controls.movement, controls.angle);
    playerView.drawPlayer(player, base.elements.ctxMain);

}


setInterval(Update , 1000/25);




