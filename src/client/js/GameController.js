import * as col from './CollisionSystem';
import {Obj} from './model/Obj';

//objective maping


const numOfobjectives = 3;

export const objectives = [];
export const objs = [];

let team0points = 0;
let team1points = 0

let database = [];

export const setDatabase = (data) => {
    database = data;
}

export const getDatabase = () => {
    return database;
}


export const Update = () =>{

    //console.log("team0points: " + team0points);

    if(team0points >= 1000 || team1points >= 1000)
    {
        win();
    }

}

const win = () =>
{
    
}

export const setTeam0Points = (value) => {
    team0points = value;
}

export const setTeam1Points = (value) => {
    team1points = value;
}





export const getTeam0Points = () =>{
    return team0points;
}

export const getTeam1Points = () => {
    return team1points;
}

export const mapTheObjective = (ctx) => {


    const columns = col.mapSize.x/ col.cellSize.x;
    const rows = col.mapSize.y/ col.cellSize.y;

    for (let i = 0; i < numOfobjectives; i ++)
    {
        objs.push(new Obj(i));
    }

    let y = -parseInt(col.cellSize.y/2)

    for(let i = 0; i < columns; i++)
    {
        y +=col.cellSize.y;

        let x = -parseInt(col.cellSize.x/2)

        for(let j = 0 ; j < rows; j++)
        {
            x += col.cellSize.x;
            let pixel = ctx.getImageData(x,y,1,1);
            const cell = col.getCellNumber(x,y);
            col.grid[cell].obj = pixel.data[0];
            if(col.grid[cell].obj != 255)
            {
                objectives.push(cell);
            }

            
        }
        
        
    }

    console.log(col.grid);
};