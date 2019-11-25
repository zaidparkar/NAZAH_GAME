import * as base from './views/base';
import { selfId, createPlayer} from './connection/Connect';
import { Player } from './model/Player';



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

//Login and registration Page event listeners

let lRSignIn = false;

export const getLRSignIn = () => {
    return lRSignIn;
} 

export const setLRSignIn = (value) => {
    lRSignIn = value;
}

base.elements.lRSignIn.addEventListener("click", () => {
    lRSignIn = true;
});

//register button

let lRRegister = false;

export const getLRRegister = () => {
    return lRRegister;
} 

export const setLRRegister = (value) => {
    lRRegister = value;
}

base.elements.lRRegister.addEventListener("click", () => {
    lRRegister = true;
});


//choose team page
let CTeamA = false;

export const getCTeamA = () => {
    return CTeamA;
} 

export const setCTeamA = (value) => {
    CTeamA = value;
}

base.elements.CTeamA.addEventListener("click", () => {
    CTeamA = true;
    
});


//team b button
let CTeamB = false;

export const getCTeamB = () => {
    return CTeamB;
} 

export const setCTeamB = (value) => {
    CTeamB = value;
}

base.elements.CTeamB.addEventListener("click", () => {
    CTeamB = true;
    
});


//login in page
let Lsignin = false;

export const getLsignin = () => {
    return Lsignin;
} 

export const setLsignin = (value) => {
    Lsignin = value;
}

base.elements.LSignIn.addEventListener("click", () => {
    Lsignin = true;
    
});


//back button
let LBack = false;

export const getLBack = () => {
    return LBack;
} 

export const setLBack = (value) => {
    LBack = value;
}

base.elements.LBack.addEventListener("click", () => {
    LBack = true;
    
});


//join game button
let joinGame = false;

export const getJoinGame = () => {
    return joinGame;
} 

export const setJoinGame = (value) => {
    joinGame = value;
}

base.elements.mJoinGame.addEventListener("click", () => {
    joinGame = true;
    
});


//options button
let option = false;

export const getoption = () => {
    return option;
} 

export const setoption = (value) => {
    option = value;
}

base.elements.mOption.addEventListener("click", () => {
    option = true;
    
});


//registration page sign in
let RSignin = false;

export const getRSignin = () => {
    return RSignin;
} 

export const setRSignin = (value) => {
    RSignin = value;
}

base.elements.RSignIn.addEventListener("click", () => {
    RSignin = true;
    
});


//registration page go back button
let RBack = false;

export const getRBack = () => {
    return RBack;
} 

export const setRBack = (value) => {
    RBack = value;
}

base.elements.RBack.addEventListener("click", () => {
    RBack = true;
    
});


//respawn page button
let XRespawn = false;

export const getXRespawn = () => {
    return XRespawn;
} 

export const setXRespawn = (value) => {
    XRespawn = value;
}

base.elements.XRespawn.addEventListener("click", () => {
    XRespawn = true;
    
});


//repsawn page options button
let XOption = false;

export const getXOption = () => {
    return XOption;
} 

export const setXOption = (value) => {
    XOption = value;
}

base.elements.XOption.addEventListener("click", () => {
    XOption = true;
    
});



let ymainBack = false;

export const getYMainBack = () => {
    return ymainBack;
} 

export const setYMainBack = (value) => {
    ymainBack = value;
}

base.elements.ymainback.addEventListener("click", () => {
    ymainBack = true;
});





let spawn = false;

export const canSpawn = () => {
    return spawn;
} 

export const setSpawn = (value) => {
    spawn = value;
}



