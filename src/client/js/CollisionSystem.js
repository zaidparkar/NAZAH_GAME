


export const grid = [];

//map size
const mapSize = {
    x: 500,
    y: 500
};

//cell size
const cellSize = {
    x: 25,
    y: 25
}

//color of the wall
//used in gridding the map
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



//setting the rows and columns for the grid
const columns = (mapSize.x/cellSize.x);
const rows = (mapSize.y/cellSize.y);


//this maps the grid
export const mapTheGrid = (ctx) =>{

    //sets the y to the starting point
    let y = parseInt(-cellSize.y/2);

    //gridding the map from left to right then top to bottom
    for(let i = 0; i < columns; i++)
    {
        
        y += cellSize.y;
        let x = parseInt(-cellSize.x/2);

        for(let j = 0; j < rows; j++)
        {

            x+= cellSize.x;

            //get the image data
            const pixel = ctx.getImageData(x, y, 1, 1);
            let occupied = false;
            //if the color matches the wall color then occpied = true
            if(pixel.data[0] == wallColor.r && pixel.data[1] == wallColor.g && pixel.data[2] == wallColor.b){
                occupied = true;
            }
            //push the new cell in the grid
            grid.push(new Cell(occupied));
        }
    }

};

//updates the grid with player movement
//if a player moves, the cells that are occupied by the player changes
//the function below does the job

export const updateGridWithPlayer = (player) =>
{
    //the player can cover four cells like a square
    //the cellnumber returns the top left cell.
    const cellNumber = getCellNumber(player.x-25, player.y-25);


    //occupying all the cells 
    const cells = [grid[cellNumber],
                    grid[cellNumber +1],
                    grid[cellNumber+columns],
                    grid[cellNumber+columns+1]];


    player.occupyGrid(cells);                


};

//get the index of the cell with x and y position
const getCellNumber = (x, y) =>
{
    const resY = parseInt(y/25) * 20;
    const resX = parseInt(x/25);

    return resX + resY ;
}

//function below occupies a cells in the grid
const occupy = (index, isOccupy = true, id = null) =>
{
    if(isNaN(index))
    {
        const cell = index;
        cell.occupied = isOccupy;
        cell.id = id;
    }else{
        grid[index].occupied = isOccupy;
        grid[index].id = id;
    }
    
};


//get the surrounding cells for the player
//this is to know if the surrounding is occupied or not
export const getSurroundingCell = (player) =>
{
    //gets the cell number from the player position
    //we deduct 25 so that we can get the top left of the character
    const cellNumber = getCellNumber(player.x-25, player.y-25);

    const cells =  [grid[cellNumber - columns], grid[cellNumber - (columns - 1)],//top
            grid[cellNumber + 2], grid[cellNumber + columns + 2],//right
            grid[cellNumber + (columns * 2) + 1], grid[cellNumber + (columns * 2)],//bottom
            grid[cellNumber + (columns - 1)], grid[cellNumber -1]];//left

     
    return cells;

}

//get cell with an x and y pos
export const getCell = (x, y) => {

    const cellNumber = getCellNumber(x, y);
    return grid[cellNumber];
} 


//for testing purposes
//send the surounding cells to the player





