
export class Player{
    //player consturtor needs an Id
    //player needs health 
    //player needs spawn position x and y

    constructor(id, x = 250, y =250){
        this.id = id;
        this.health = 100;
        this.x =x;
        this.y =y;
        this.speed = 10;
        this.angle = 0;
        this.preMovement = {
            x : this.x,
            y : this.y,
            angle : this.angle
        }

        //Add the player to the player list automatically
        //Player.list is initialized down below
        Player.list[this.id] = this;
    }

    //updates the movement
    // it recieves the controls key and angle from the mouse movement as the parameters
    update(movement, angle){

        //updates the position if any key is pressed
        if(movement.pressingRight){
            this.x += this.speed;
        } else if (movement.pressingUp){
            this.y += this.speed;
        } else if (movement.pressingLeft){
            this.x -= this.speed;
        } else if (movement.pressingDown){
            this.y -= this.speed;
        }

        //assigns the angle of mouse movement to the angle of the player
        this.angle = angle;

    }

    //returns true if the player moved or looked
    isChanged()
    {
        let changed = false;

        if(this.preMovement.x = this.x)
        {
            changed = true;
        }else if (this.preMovement.y = this.y)
        {
            changed = true;
        }else if (this.preMovement.angle = this.angle){
            changed = true;
        }
        if(changed)
        {
            this.preMovement.x = this.x;
            this.preMovement.y = this.y;
            this.preMovement.angle = this.angle
        }
        return changed;

    }
}




//This is a global list that lists all the instance of Player class.
//So basically all the players in the server
//This wil only be useful when there is server side implementation
Player.list={};
