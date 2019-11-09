import { selfPlayer} from './connection/Connect';
import {Player} from './model/Player';
import * as playerView from './views/playerView';
import * as bulletView from './views/bulletView';
import * as base from './views/base';
import {getControl} from './Control';
import {Bullet} from './model/Bullet';
import * as mapView from './views/mapView';
import * as CollisionSystem from './CollisionSystem';




const init = () =>
{
    //base.elements.ctxMain.clearRect(0,0,500,500);
    //draw the map
    mapView.drawMap(base.elements.ctxMain);

    CollisionSystem.mapTheGrid(base.elements.ctxMain);

    //runs the interval in 25 fps
    setInterval(Update , 1000/25);

}



const Update = () =>{
    
    if(selfPlayer)
    {
        //gets the context of the canvas
        //clears it
        base.elements.ctxMain.clearRect(0,0,500,500);
        console.log(selfPlayer.health);

        mapView.drawMap(base.elements.ctxMain);
        //grid debug
        //mapView.drawGrid(base.elements.ctxMain, CollisionSystem.grid);

        

        //get the input controls
        const controls = getControl(selfPlayer);

        //get the surrounding cells
        const cells = CollisionSystem.getSurroundingCell(selfPlayer);

        // updates movement and the angle
        selfPlayer.update(controls.movement, controls.angle, controls.click, cells);


        
        for(const i in Bullet.list){
            const bullet = Bullet.list[i];
            //gets the cell to check for collision
            const cell = CollisionSystem.getCell(bullet.x, bullet.y);
            //updates the bullet
            bullet.update(CollisionSystem.getCell);
            //draws the bullet
            bulletView.drawBullet(bullet, base.elements.ctxMain);
            
        }
        
        

        //draws the player in the canvas
        for(let id in Player.list)
        {
            const player = Player.list[id];
            playerView.drawPlayer(player, base.elements.ctxMain);
            //updates the grid
            CollisionSystem.updateGridWithPlayer(player);
        }
        
        
    }



}

setTimeout(init, 100);







