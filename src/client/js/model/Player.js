


export class Player {
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
        Player.list[this.id] = this;
    }

    //updates the movement
    update(movement, angle){

        if(movement.pressingRight){
            this.x += this.speed;
        } else if (movement.pressingUp){
            this.y += this.speed;
        } else if (movement.pressingLeft){
            this.x -= this.speed;
        } else if (movement.pressingDown){
            this.y -= this.speed;
        }

        this.angle = angle;

    }

    /*
    drawSelf(ctx = elements.ctx, angle = 0)
    {
        ctx.save();
        ctx.height = 75;
        ctx.width = 75;
        if(angle == 0)
            angle = this.getAngle(this.x, this.y, mouseX, mouseY);

        console.log(angle);    
        ctx.translate(this.x, this.y);
        ctx.rotate(angle - deg_to_rad(90));
        ctx.drawImage(this.img,-this.img.width/2,-this.img.height/2, this.img.width, this.img.height);
        ctx.restore();
    } */ 
}




//This is a global list that lists all the instance of Player class.
//So basically all the players in the server
//This wil only be useful when there is server side implementation
Player.list={};


// Controller code




//handler for the update loop every frames





