import * as base from './base';
import * as CollisionSystem from '../CollisionSystem';

export const mapImg = base.getImage(base.pathStrings.map, CollisionSystem.mapSize.x, CollisionSystem.mapSize.y);
export const mapObjImg = base.getImage(base.pathStrings.mapObj, CollisionSystem.mapSize.x, CollisionSystem.mapSize.y);

export const drawMap = (ctx, x = 0, y = 0) =>{

    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);
    ctx.restore();

}

export const drawMapObj = (ctx) =>{

    ctx.save();
    ctx.drawImage(mapObjImg, 0, 0, mapObjImg.width, mapObjImg.height);
    ctx.restore();

}

// this draws red on the cells that are occupied
export const drawGrid = (ctx) =>{
    ctx.save();
    
    //get columns and rows
    const columns = CollisionSystem.mapSize.x/ CollisionSystem.cellSize.x ;
    const rows =  CollisionSystem.mapSize.y/ CollisionSystem.cellSize.y ;

    //create an imagedata
    const pixel = ctx.createImageData(10,10);

    //turn the pixell into red
    for(let i =0; i < pixel.data.length; i +=4)
    {
        pixel.data[i+0] = 255;
        pixel.data[i+1] = 0;
        pixel.data[i+2] = 0;
        pixel.data[i+3] = 255;
    }

    //put the image data into the right slots
    let y = -(CollisionSystem.cellSize.y/2);

    for(let i = 0; i < columns; i++)
    {
        y += CollisionSystem.cellSize.y;
        let x = -(CollisionSystem.cellSize.x/2);
        for(let j = 0; j < rows; j++)
        {
            x += CollisionSystem.cellSize.x;
            if(CollisionSystem.grid[(i * 20) + j ].occupied)
            {
                ctx.putImageData(pixel, x, y);
            }
        }
    }
    //ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);

    ctx.restore();
}

export const drawGridObj = (ctx ,relx = 0 , rely = 0 ) => {

    const columns = CollisionSystem.mapSize.x/ CollisionSystem.cellSize.x ;
    const rows =  CollisionSystem.mapSize.y/ CollisionSystem.cellSize.y ;

    const grid = CollisionSystem.grid;
    for(let i = 0; i < grid.length; i++)
    {
        
        const cellNumber = i;
        
        if(grid[i].obj != null)
        {
            const y = parseInt(cellNumber/columns) * CollisionSystem.cellSize.y;
            const x = (cellNumber % rows) * CollisionSystem.cellSize.x;
    
            ctx.save();
    
            ctx.fillRect(x + 12.5 + relx, y + 12.5 + rely, 12.5 ,12.5);
    
            ctx.restore();
        }

        
    }

}