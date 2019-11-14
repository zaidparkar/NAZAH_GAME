


export const drawBullet = (bullet,ctx,x,y) =>{

    ctx.save();

    //alternates the context transform to draw the player
    // some of the values are hardcoded and waiting for replacement
    ctx.height = 75;
    ctx.width = 50;
    ctx.translate(bullet.x + x, bullet.y + y);
    ctx.rotate(bullet.angle);
    ctx.fillRect(0,0,10,10);

    //restores the contexts transform
    ctx.restore();

}
