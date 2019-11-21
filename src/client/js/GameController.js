import * as col from './CollisionSystem';
import {Obj} from './model/Obj';

//objective maping


const numOfobjectives = 3;

export const objectives = [];

let team0points = 0;
let team1points = 0



export const Update = () =>{

    for (let i = 0; i< numOfobjectives; i++)
    {
        if(objectives[i].team0points == 100)
        {
            team0points += 1/35;
        }else if(objectives[i].team1points == 100 )
        {
            team1points += 1/35;
        }
    }

    if(team0points >= 1000 || team1points >= 1000)
    {
        win();
    }

}

const win = () =>
{
    
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
        objectives.push(new Obj(i));
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