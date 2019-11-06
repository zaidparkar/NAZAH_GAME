import * as base from './base';

export const mapImg = base.getImage(base.pathStrings.map, 500, 500);

export const drawMap = (ctx) =>{



    ctx.save();
    ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);

    ctx.restore();

}