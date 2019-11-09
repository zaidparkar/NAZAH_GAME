import * as base from './base';

export const mapImg = base.getImage(base.pathStrings.map, 500, 500);

export const drawMap = (ctx) =>{



    ctx.save();
    ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);

    ctx.restore();

}

export const drawGrid = (ctx, grid) =>{
    ctx.save();
    
    const columns = 20 ;
    const rows = 20;
    const pixel = ctx.createImageData(10,10);

    for(let i =0; i < pixel.data.length; i +=4)
    {
        pixel.data[i+0] = 255;
        pixel.data[i+1] = 0;
        pixel.data[i+2] = 0;
        pixel.data[i+3] = 255;
    }

    
    let y = -12;

    for(let i = 0; i < columns; i++)
    {
        y += 25;
        let x = -12;
        for(let j = 0; j < rows; j++)
        {
            x += 25;
            if(grid[(i * 20) + j ].occupied)
            {
                ctx.putImageData(pixel, x, y);
            }
        }
    }
    //ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);

    ctx.restore();
}