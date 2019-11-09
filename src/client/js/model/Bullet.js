import {Entity} from './Entity';

export class Bullet extends Entity{

    constructor(id,x=250,y=250){
      super(id, x, y);
      Bullet.list[this.id] = this;
      this.timer = 0;
      this.speed = 24;
    }

    update(){
      this.timer ++;  
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed ;
      console.log(this.timer);
      if(this.timer > 24){
        delete Bullet.list[this.id];
      }

    }
    
    checkOccupied()
    {

    }

  
}

Bullet.list = {};
