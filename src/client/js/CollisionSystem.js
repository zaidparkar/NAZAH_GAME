

const grid = [];


const mapSize = {
    x: 500,
    y: 500
};

const cellSize = {
    x: 25,
    y: 25
}

const wallColor = {
    r:255,
    g:255,
    b:255
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
const mapTheGrid = (img,ctx) =>{

    const columns = (mapSize.x/cellSize.x);
    const rows = (mapSize.y/cellSize.y);

    let x = -cellSize/2;
    let y = -cellSize/2;

    for(let i = 0; i < columns; i++)
    {
        x += cellSize;
        y = -cellSize/2;
        for(let j = 0; j < rows; i++)
        {
            y += cellSize;
            const pixel = ctx.getImageData(x, y, 1, 1);
            let occupied = false;
            if(pixel.data[0] == wallColor.r && pixel.data[1] == wallColor.g && pixel.data[2] == wallColor.b){
                occupied = true;
            }

            grid.push(new Cell(occupied));
        }
    }

};

const checkOccupied = (cells) => {
    
    for(let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        if(Player.x == cell[i].x || Player.y == cell[i].y)  {
            cell[i].occupied = true;
            cell[i+1].occupied = true;
        }
        else  {
            cell[i].occupied = false;
            cell[i+1].occupied = false; 
        }
    }
}

//for testing purposes
//send the surounding cells to the player
export const cells = [new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false),
                    new Cell(false),new Cell(false)];





