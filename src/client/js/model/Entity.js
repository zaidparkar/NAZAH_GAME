export class Entity{

    constructor(id,x = 250 ,y =250){
       this.id=id;
       this.x=x;
       this.y=y;
       this.speed=10;
       this.angle=0;

    }
    //gets distance between the two objects 
    getDistance(obj1,obj2)  {
        var distX = obj2.x - obj1.x;
        var distY = obj2.y - obj1.y;
        return Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
    }

    //Alerts the console that the objects have collided
    checkCollision(obj1,obj2)  {
        if(getDistance(obj1,obj2) < 10);
            console.log("Collision Alert");
    }
  
}