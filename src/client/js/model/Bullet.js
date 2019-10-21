import {Entity} from './Entity';

export class Bullet extends Entity{

    constructor(id,x=250,y=250){
      super(id, x, y);
      Bullet.list[this.id] = this;
    }

    update(){
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed ;
      this.timer=0;
      this.toRemove=false;
      if(this.timer++ > 100){
        this.toRemove=true;s
      }

    }
    

  
}

Bullet.list = {};
