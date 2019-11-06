

export const grid = [];


const mapSize = {
    x: 500,
    y: 500
};

const cellSize = {
    x: 25,
    y: 25
}

const wallColor = {
    r:149,
    g:134,
    b:129   
}


//Cell class for the cells in the grid
class Cell{

    constructor(occupied, id = null){
        this.occupied = occupied;
        this.id = id;
    }

}

//for testing
const img = new Image();


//this maps the grid
export const mapTheGrid = (ctx) =>{

    const columns = (mapSize.x/cellSize.x);
    const rows = (mapSize.y/cellSize.y);

    let y = parseInt(-cellSize.y/2);



    for(let i = 0; i < columns; i++)
    {
        
        y += cellSize.y;
        let x = parseInt(-cellSize.x/2);

        for(let j = 0; j < rows; j++)
        {

            x+= cellSize.x;
            const pixel = ctx.getImageData(x, y, 1, 1);
            let occupied = false;
            if(pixel.data[0] == wallColor.r && pixel.data[1] == wallColor.g && pixel.data[2] == wallColor.b){
                occupied = true;
            }
            ctx.putImageData(pixel, x, y);

            grid.push(new Cell(occupied));
        }
    }

};

//for testing purposes
//send the surounding cells to the player
export const cells = [new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false)];





