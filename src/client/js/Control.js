import * as base from './views/base'



const controlKeys = {
    pressingRight:false,
    pressingUp:false,
    pressingLeft:false,
    pressingDown:false,
    mouseX: 0,
    mouseY: 0,
    click:false
} 


//Gets the angle from two points
const getAngle = (x1, y1, x2, y2) => {
    let distY = (y2-y1); //opposite
    let distX = (x2-x1); //adjacent

    //use atan2 to get the angle
    let radians = Math.atan2(distX,-distY);
    //converting the radians to deg
    let angle = rad_to_deg(radians);

    //Originally the degree goes to a max 180 and turns to negative 180
    //to solve this problem I have put this if statement to get an angle of full 360 degrees
    if(angle < 0){
        angle = 360 + angle;
    }
    // converting the final angle to radians 
    angle = deg_to_rad(angle);
    return angle;
}


// method to convert radian to deg
const rad_to_deg = (radians) =>{
    return radians * (180/Math.PI);
};

// method to convert deg to radian
const deg_to_rad = (degrees) =>{
    return degrees / (180/Math.PI);
};



//event handler for the keyup
//all the values for pressing keys are set to false
window.addEventListener('keyup', (e) =>
{

    if(e.keyCode === 68)// d
    {
        controlKeys.pressingRight = false
    }else if(e.keyCode ===83)// s
    {
        controlKeys.pressingDown = false;

    }else if(e.keyCode ===65)// a
    {
        controlKeys.pressingLeft = false;

    }else if(e.keyCode === 87)// w
    {
        controlKeys.pressingUp = false;

    }

    
});
window.addEventListener('mousedown',(e)=>{
    controlKeys.click=true;
    
});

window.addEventListener('mouseup',(e)=>{
    controlKeys.click=false;
    
});



//event handler for the keydown
//all the values for pressing keys are set to true
window.addEventListener('keydown', (e)=>{

    if(e.keyCode === 68)//Pressing d
    {
        controlKeys.pressingRight = true;
    }else if(e.keyCode ===83)//Pressing s
    {
        controlKeys.pressingDown = true;

    }else if(e.keyCode ===65)//Pressing a
    {
        controlKeys.pressingLeft = true;
    }else if(e.keyCode === 87)//Pressing w
    {
        controlKeys.pressingUp = true;

    }

});



//Gets the boundaries of the canvas
const rect = base.elements.canvasMain.getBoundingClientRect();


//event handler for mouse movement
//stores the position of the mouse relative to the canvas
base.elements.canvasMain.addEventListener('mousemove', (e) => {
    controlKeys.mouseX = e.clientX - rect.left;
    controlKeys.mouseY = e.clientY - rect.top;
});

//This function returns the angle of the player in terms of mouse position
//It also returns the keypress.
export const getControl = (player ,relativeX = 0, relativeY = 0)  =>{

    const mouseX = controlKeys.mouseX;
    const mouseY = controlKeys.mouseY;

    const angle = getAngle(mouseX,mouseY, player.x + relativeX, player.y + relativeY) + deg_to_rad(90);

    return{
        movement : {
            pressingRight: controlKeys.pressingRight,
            pressingUp: controlKeys.pressingUp,
            pressingLeft: controlKeys.pressingLeft,
            pressingDown: controlKeys.pressingDown

        },
        angle : angle,
        click : controlKeys.click
    }
}




