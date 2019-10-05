import * as base from './base';
import * as Control from '../Control'




export const drawPlayer = (player,ctx) =>
{
    const img = base.getImage(base.pathStrings.trial,75,50);
    ctx.save();
    ctx.height = 75;
    ctx.width = 50;
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.drawImage(img, -img.width/2, -img.height/2, img.width, img.height);
    ctx.restore();

}

