import {Entity} from './Entity';
import { Bullet } from './Bullet';

export class Player extends Entity {
    //player consturtor needs an Id
    //player needs health 
    //player needs spawn position x and y

    constructor(id, x = 250, y =250){
        super(id, x, y);
        this.health = 100;

        //Add the player to the player list automatically
        //Player.list is initialized down below
        Player.list[this.id] = this;
    }

    //updates the movement
    // it recieves the controls key and angle from the mouse movement as the parameters
    update(movement, angle, click){

        console.log("click"+click);
        //updates the position if any key is pressed
        if(movement.pressingRight){
            this.x += this.speed;
        } else if (movement.pressingUp){
            this.y += this.speed;
        } else if (movement.pressingLeft){
            this.x -= this.speed;
        } else if (movement.pressingDown){
            this.y -= this.speed;
        } else if(click){
            this.shoot();
        }


        //assigns the angle of mouse movement to the angle of the player
        this.angle = angle;

        //this.shoot(click);

    }

    shoot(){

            const bullet = new Bullet(Math.random,this.x,this.y);
            bullet.angle=this.angle;
            console.log("Im shooting");

       
    }
}




//This is a global list that lists all the instance of Player class.
//So basically all the players in the server
//This wil only be useful when there is server side implementation
Player.list={};
