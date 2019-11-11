import {Entity} from './Entity';

export class Bullet extends Entity{

    constructor(id,playerId,x=250,y=250){
      super(id, x, y);
      Bullet.list[this.id] = this;
      this.playerId = playerId;
      this.timer = 0;
      this.speed = 100;
      this.destroyed = false;
      this.hitId = null;
    }

    update(getCell){
        if(!this.destroyed)
        {
            this.timer ++;  
            const pos = this.move(this.speed);
            this.x = pos.x;
            this.y = pos.y;
            //console.log(this.timer);
            //deletes itself after 24 frames or 1 second
            if(this.timer > 24){
                this.destroyed = true;
                delete Bullet.list[this.id];
            }
      
      
            //checks if the cell is occupied
            this.hitRay(getCell);
      
        }
 
    }
    

    hitRay(getCell)
    {
        for (let i = 0; i < this.speed; i +=25)
        {
            const pos = this.move(i);
            const cell = getCell(pos.x, pos.y);
            if(cell)
            {
                if(cell.occupied && cell.id != this.playerId)
                {
                    console.log("Bullet got hit from hit ray");
                    this.destroyed = true;
                    this.hitId = cell.id;
                    delete Bullet.list[this.id];
                }
            }
        }
    }

    move(dist)
    {
        let x = this.x + (Math.cos(this.angle) * dist);
        let y = this.y + (Math.sin(this.angle) * dist);

        return{
            x:x,
            y:y
        }
    }

  
}

Bullet.list = {};
