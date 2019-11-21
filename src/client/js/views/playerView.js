import * as base from "./base";

//draws the player on a canvas
//after recieving a player and a canvas context as parameter
let frameList = [1,2,1,0];

export const drawPlayer = (player, ctx, x = 0, y = 0,) => {
  //Gets the image of the player
    let img ;
    if(player.team ==1)
    {
        img = base.getImage(base.pathStrings.redPlayer, 100, 100);
    }else{
        img = base.getImage(base.pathStrings.bluePlayer, 100, 100);
    }


  //saves the context transform
  ctx.save();   

  //alternates the context transform to draw the player
  // some of the values are hardcoded and waiting for replacement

  //ctx.translate(player.x, player.y);

  if(player.isChanged())
  {
      player.frameHelper1++;
      if(player.frameHelper1 >= 3)
      {
        player.frameHelper2++;
        if(player.frameHelper2 >= frameList.length)
        {
            player.frameHelper2 = 0;
        }
        player.frameHelper1= 0;
      }
      
  }


  
  ctx.translate(player.x + x, player.y + y);
  ctx.rotate(player.angle);
  ctx.drawImage(img, frameList[player.frameHelper2] * 100 , 0, 100, 100, -img.width / 2, -img.height / 2, img.width, img.height);

  //restores the contexts transform
  ctx.restore();
};

export const updateAmmoUI = player => {
  base.elements.Ammo.textContent = "" + player.ammoInMag + "|" + player.ammo;
};
