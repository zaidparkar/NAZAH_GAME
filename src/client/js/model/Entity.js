export class Entity{

    constructor(id,x = 250 ,y =250){
       this.id=id;
       this.x=x;
       this.y=y;
       this.speed=10;
       this.angle=0;

    }
    //gets distance between the two objects 
    getDistance(obj)  {
        var distX = this.x - obj.x;
        var distY = this.y - obj.y;
        return Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
    }

    //Alerts the console that the objects have collided
    checkCollision(obj1)  {
        if(getDistance(obj1) < 5)
            console.log("Collision Alert");
    }

    /*update()  {
        this.checkCollision(Player);
    this.x < obj1.x + obj1.w && this.x + this.w > obj1.x && this.y < obj1.y + obj1.h && this.y + this.h > obj1.y
    }*/
  
}