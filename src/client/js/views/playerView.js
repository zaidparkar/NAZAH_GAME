import * as base from './base';




//draws the player on a canvas 
//after recieving a player and a canvas context as parameter
export const drawPlayer = (player,ctx, x = 0, y =0) =>
{
    //Gets the image of the player
    const img = base.getImage(base.pathStrings.trial,75,50);

    //saves the context transform
    ctx.save();

    //alternates the context transform to draw the player
    // some of the values are hardcoded and waiting for replacement

    //ctx.translate(player.x, player.y);
    ctx.translate(player.x + x, player.y + y);
    ctx.rotate(player.angle);
    ctx.drawImage(img, -img.width/2, -img.height/2, img.width, img.height);

    //restores the contexts transform
    ctx.restore();

}

