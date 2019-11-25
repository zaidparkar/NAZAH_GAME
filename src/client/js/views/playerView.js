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

export const updateHealth = player => {
    base.elements.Health.children[0].style.width = ""+player.health+"%"
}

export const updateScore = (team0, team1) => {
    team1 = parseInt(team1)
    base.elements.Bar1.children[0].textContent = team1;
    base.elements.Bar1.children[1].style.width = "" + team1/10+ "%";

    team0 = parseInt(team0)
    base.elements.Bar2.children[0].textContent = team0;
    base.elements.Bar2.children[1].style.width = "" + team0/10+ "%";
    
}

export const updateObjScore = (obj = null, num= null) =>{
    if(obj != null)
    {

        const ele = base.elements.objectiveLetter.children;

        for(let i = 0; i < ele.length; i++)
        {
            ele[i].style.display = 'none';
        }

        base.elements.objectiveLetter.children[num].style.display = 'block';
        base.elements.objBar.style.display = 'block';

        if(obj.team0capture > obj.team1capture)
        {
            base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.style.width = ''+obj.team0capture+'%';
            if(base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-white'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.remove('w3-white');
            if(base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-red'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.remove('w3-red');
            if(!base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-blue'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.add('w3-blue');  
                
        }else{
            base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.style.width = ''+obj.team1capture+'%';
            if(base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-white'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.remove('w3-white');
            if(base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-blue'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.remove('w3-blue');
            if(!base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.contains('w3-red'))
                base.elements.objBar.firstElementChild.firstElementChild.firstElementChild.classList.add('w3-red');  
        }

        

    }
    else
    {
        
        const ele = base.elements.objectiveLetter.children;

        for(let i = 0; i < ele.length; i++)
        {
            ele[i].style.display = 'block';
        }
    }
}
