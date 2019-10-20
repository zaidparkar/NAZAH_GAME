import { selfPlayer} from './connection/Connect';
import {Player} from './model/Player';
import * as playerView from './views/playerView';
import * as bulletView from './views/bulletView';
import * as base from './views/base';
import {getControl} from './Control';
import {Bullet} from './model/Bullet';







const Update = () =>{
    
    if(selfPlayer)
    {
        //gets the context of the canvas
        //clears it
        base.elements.ctxMain.clearRect(0,0,500,500);

        //get the input controls
        const controls = getControl(selfPlayer);

        // updates movement and the angle
        selfPlayer.update(controls.movement, controls.angle, controls.click);
        
        for(const i in Bullet.list){
            const bullet = Bullet.list[i];
            bullet.update();
            bulletView.drawBullet(bullet, base.elements.ctxMain);
            
        }

        

        //draws the player in the canvas
        for(let id in Player.list)
        {
            const player = Player.list[id];
            playerView.drawPlayer(player, base.elements.ctxMain);
        }
        
    }

}

//runs the interval in 25 fps
setInterval(Update , 1000/25);




