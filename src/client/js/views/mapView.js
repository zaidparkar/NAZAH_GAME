import * as base from './base';
import * as CollisionSystem from '../CollisionSystem';

export const mapImg = base.getImage(base.pathStrings.map, CollisionSystem.mapSize.x, CollisionSystem.mapSize.y);

export const drawMap = (ctx, x = 0, y = 0) =>{

    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);
    ctx.restore();

}

// this draws red on the cells that are occupied
export const drawGrid = (ctx, grid) =>{
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
            if(grid[(i * 20) + j ].occupied)
            {
                ctx.putImageData(pixel, x, y);
            }
        }
    }
    //ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);

    ctx.restore();
}