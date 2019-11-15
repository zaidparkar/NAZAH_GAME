import { selfPlayer} from './connection/Connect';
import {Player} from './model/Player';
import * as playerView from './views/playerView';
import * as bulletView from './views/bulletView';
import * as base from './views/base';
import {getControl} from './Control';
import {Bullet} from './model/Bullet';
import * as mapView from './views/mapView';
import * as GameController from './GameController';
import * as CollisionSystem from './CollisionSystem';




const mapwidth = CollisionSystem.mapSize.x;
const mapheight = CollisionSystem.mapSize.y;

const screenWidth = document.documentElement.clientWidth -20;
const screenHeight =  document.documentElement.clientHeight- 20;

const init = () =>
{
    //base.elements.ctxMain.clearRect(0,0,500,500);
    //draw the map

    base.elements.canvasMain.height = mapheight;
    base.elements.canvasMain.width = mapwidth;
    
    
    mapView.drawMap(base.elements.ctxMain);

    CollisionSystem.mapTheGrid(base.elements.ctxMain);

    mapView.drawMapObj(base.elements.ctxMain);

    GameController.mapTheObjective(base.elements.ctxMain);

    mapView.drawMap(base.elements.ctxMain);

    base.elements.canvasMain.height = screenHeight;
    base.elements.canvasMain.width = screenWidth;

    //runs the interval in 25 fps
    setInterval(Update , 1000/25);

}


const getRelativeXY = () =>{

    let relativeX = screenWidth/2 - selfPlayer.x ;
    let relativeY = screenHeight/2 - selfPlayer.y ;

    const inBoundaryX = screenWidth/2 < selfPlayer.x && selfPlayer.x < (CollisionSystem.mapSize.x - screenWidth/2);
    const inBoundaryY = screenHeight/2 < selfPlayer.y && selfPlayer.y < (CollisionSystem.mapSize.y - screenHeight/2);


    if(inBoundaryX)
    {
        relativeX = screenWidth/2 - selfPlayer.x ;
    }
    else{
        if(selfPlayer.x < screenWidth/2)
            relativeX = 0;
        else
            relativeX = screenWidth - CollisionSystem.mapSize.x ;    
    }

    if(inBoundaryY)
    {
        relativeY = screenHeight/2 - selfPlayer.y ; 
    }
    else{
        if(selfPlayer.y < screenHeight/2)
            relativeY = 0;
        else
            relativeY = screenHeight - CollisionSystem.mapSize.y ;    
    }      
    return {
        x: relativeX,
        y: relativeY
    }                                                 
}



const Update = () =>{
    
    if(selfPlayer)
    {
        GameController.Update();

        let reltivitity = getRelativeXY();
        //get the input controls
        const controls = getControl(selfPlayer, reltivitity.x , reltivitity.y);

        //get the surrounding cells
        const cells = CollisionSystem.getSurroundingCell(selfPlayer);

        // updates movement and the angle
        selfPlayer.update(controls.movement, controls.angle, controls.click, cells);



        
        base.elements.ctxMain.clearRect(0,0,screenWidth,screenHeight);
        //console.log(selfPlayer.obj);

        reltivitity = getRelativeXY();

        mapView.drawMap(base.elements.ctxMain, reltivitity.x, reltivitity.y);
        //grid debug
        //mapView.drawGrid(base.elements.ctxMain);
        //mapView.drawGridObj(base.elements.ctxMain, reltivitity.x, reltivitity.y);

        
        
        for(const i in Bullet.list){
            const bullet = Bullet.list[i];
            //gets the cell to check for collision
            const cell = CollisionSystem.getCell(bullet.x - selfPlayer.x, bullet.y, selfPlayer.y);
            //updates the bullet
            bullet.update(CollisionSystem.getCell);
            //draws the bullet
            bulletView.drawBullet(bullet, base.elements.ctxMain, reltivitity.x, reltivitity.y);
            
        }
        
        

        //draws the player in the canvas
        for(let id in Player.list)
        {
            const player = Player.list[id];
            playerView.drawPlayer(player, base.elements.ctxMain, reltivitity.x, reltivitity.y);   
            //updates the grid
            CollisionSystem.updateGridWithPlayer(player);
        }
        
        
    }



}

setTimeout(init, 300);







