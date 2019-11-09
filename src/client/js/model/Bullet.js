import {Entity} from './Entity';

export class Bullet extends Entity{

    constructor(id,playerId,x=250,y=250){
      super(id, x, y);
      Bullet.list[this.id] = this;
      this.playerId = playerId;
      this.timer = 0;
      this.speed = 24;
      this.cell = null;
      this.destroyed = false;
    }

    update(cell){
        if(!this.destroyed)
        {
            this.timer ++;  
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed ;
            //console.log(this.timer);
            //deletes itself after 24 frames or 1 second
            if(this.timer > 24){
                this.destroyed = true;
                delete Bullet.list[this.id];
            }
      
            this.cell = cell;
      
            //checks if the cell is occupied
            this.checkOccupied();
      
        }
 
    }
    
    checkOccupied()
    {
        //deletes if the cell is occupied and the cell id is not the playerId
        if(this.cell.occupied && this.cell.id != this.playerId)
        {
            this.destroyed = true;
            delete Bullet.list[this.id];
        }
    }

  
}

Bullet.list = {};
