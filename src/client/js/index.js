import * as Connect from "./connection/Connect";
import { Player } from "./model/Player";
import * as playerView from "./views/playerView";
import * as bulletView from "./views/bulletView";
import * as base from "./views/base";
import * as Control from "./Control";
import { Bullet } from "./model/Bullet";
import * as mapView from "./views/mapView";
import * as GameController from "./GameController";
import * as CollisionSystem from "./CollisionSystem";
import * as scoreboardView from "./views/scoreboardView";

const mapwidth = CollisionSystem.mapSize.x;
const mapheight = CollisionSystem.mapSize.y;

const screenWidth = document.documentElement.clientWidth - 15;
const screenHeight = document.documentElement.clientHeight - 15;
let count = 30 *25 ;

let updateLoop;

const spawnInterval = () => {
    const interval = setInterval(() => {
        if(Connect.getTeamSet())
            if (Control.canSpawn()) {
                Control.setSpawn(false);
                Connect.setTeamSet(false);
                setTimeout(init, 300);
                clearInterval(interval);
            }
    }, 40);
};

const loginRegisterState = () => {
  //only display the lRpage
    base.elements.canvasMain.style.display = "none";
    base.elements.lRPage.style.display = "block";

    //listen for the event listeners
    if(!Connect.isGameFull)
    {
        const eventInterval = setInterval(() => {
            if (Control.getLRSignIn()) {
                Control.setLRSignIn(false);
                clearInterval(eventInterval);
                //mainMenuState();
                signInState();
            }else if(Control.getLRRegister())
            {
                Control.setLRRegister(false);
                clearInterval(eventInterval);
                registrationState();
            }
        }, 40);
    }
};

const signInState = () => {
    base.elements.lRPage.style.display = "none";
    base.elements.loginPage.style.display = "block";

    let userName;
    let password;
    const checkDetails = () =>{
        Connect.setSignInDetails(userName, password);      
    }

    const eventInterval = setInterval(() => {
            if (Control.getLsignin()) {
                userName = base.elements.loginId.value;
                password = base.elements.loginPass.value;
                Control.setLsignin(false);
                checkDetails();
                Connect.setEmitSignIn(true);
                clearInterval(eventInterval);
                checkSignInState();
            }
        }, 40);
};

const checkSignInState = () => {

    setTimeout( () =>{
        let res = Connect.checkSignIn();
        if(res)
        {
            base.elements.loginPage.style.display = "none";
            mainMenuState();
        }else{
            signInState();
        }
    },1000)
}

const registrationState = () => {
    base.elements.lRPage.style.display = "none";
    base.elements.register.style.display = "block";

    let userName;
    let password;

    const eventInterval = setInterval( () => {
        if(Control.getRSignin())
        {
            if(base.elements.registerPass.value == base.elements.registerPass2.value)
            {
                userName = base.elements.registerId.value;
                password = base.elements.registerPass.value;
                Connect.setEmitRegister(true);
                Connect.setRegisterDetails(userName, password);
                Control.setRSignin(false);
                clearInterval(eventInterval);
                checkRegisterState();
            }
        }
    },40)

}

const checkRegisterState = () => {

    setTimeout( () =>{
        let res = Connect.checkRegester();
        if(res)
        {
            base.elements.register.style.display = "none";
            mainMenuState();
        }else{
            registrationState();
        }
    },1000)
}



const mainMenuState = () => {
    base.elements.mainMenu.style.display = "block";
    base.elements.lRPage.style.display = "none";
    base.elements.scoreboardPage.style.display = 'none';

    //listen for the intervals
    const eventInterval = setInterval(() => {
        if(Connect.isGameRunning)
        {
            if (Control.getJoinGame()) {
                Control.setJoinGame(false);
                Control.setSpawn(true);
                clearInterval(eventInterval);
                //chooseTeamState();
                startState();
            }
        }else{
            scoreboardState();
        }
    }, 40);
};


const scoreboardState = () => {

    scoreboardView.drawScoreboard(GameController.getDatabase());

    base.elements.canvasMain.style.display = "none";
    base.elements.Playerui.style.display = "none";
    base.elements.timer.style.display = "none";
    base.elements.scoreboardPage.style.display = "block";

    if(!Connect.isGameRunning){
        base.elements.timer.style.display = "block";
        base.elements.ymainback.style.display = "none";

        
        const eventInterval = setInterval(() => {
            if(count <= 0){
                base.elements.timer.style.display = "none";
                base.elements.ymainback.style.display = "block";
                if(Control.getYMainBack())
                {
                    Control.setYMainBack(false);
                    mainMenuState();
                    clearInterval(eventInterval);
                    count = 30 * 25;
                }
            }else{
                base.elements.timer.textContent = `Game will start after: ${parseInt(count/25)} seconds `;
                count--;
            }
        },40);
    }else{
        base.elements.timer.style.display = "none";
        base.elements.ymainback.style.display = "block";
        const eventInterval = setInterval(() => {
                if(Control.getYMainBack())
                {
                    Control.setYMainBack(false);
                    mainMenuState();
                    clearInterval(eventInterval);
                }

        },40);
    }
}

/*
const chooseTeamState = () => {
    base.elements.mainMenu.style.display = "none";
    base.elements.respawnPage.style.display = "block";

      //listen for the intervals
  const eventInterval = setInterval(() => {
    if (Control.getCTeamA() && !Control.canSpawn()) {
        Control.setCTeamA(false);
        Control.setSpawn(true);
        clearInterval(eventInterval);
        Connect.selfPlayer.team = 0;
        startState();
    }else if(Control.getCTeamB() && !Control.canSpawn()){
        Control.setCTeamB(false);
        Control.setSpawn(true);
        clearInterval(eventInterval);
        Connect.selfPlayer.team = 1;
        startState();
    }
  }, 40);

}*/

const respawnState = () =>{
    base.elements.canvasMain.style.display = "none";
    base.elements.Playerui.style.display = "none";
    base.elements.respawnPage.style.display = "block";

    const eventInterval = setInterval(() => {
        if(Connect.isGameRunning)
        {
            if(Control.getXRespawn())
            {
                clearInterval(eventInterval);
                Control.setXRespawn(false);
                Control.setSpawn(true);
                startState();
            }else if(Control.getXScore()){
                clearInterval(eventInterval);
                Control.setXScore(false);
                scoreboardState();
            }
        }else{
            scoreboardState();
        }
        
        

    }, 40);

}


const startState = () => {
  base.elements.mainMenu.style.display = "none";
  base.elements.respawnPage.style.display = "none";
  base.elements.canvasMain.style.display = "block";
  base.elements.Playerui.style.display = "block";

  base.elements.canvasMain.height = screenHeight;
  base.elements.canvasMain.width = screenWidth;

  base.elements.ctxMain.clearRect(0, 0, screenWidth, screenHeight);

  Connect.setEmitTeam(true);

  //base.elements.spawnBtn.style.display = 'block';

  spawnInterval();
};

const init = () => {
  //base.elements.ctxMain.clearRect(0,0,500,500);
  //draw the map

    base.elements.canvasMain.height = mapheight;
    base.elements.canvasMain.width = mapwidth;

    mapView.drawMap(base.elements.ctxMain);

    CollisionSystem.mapTheGrid(base.elements.ctxMain);
    mapView.drawMapObj(base.elements.ctxMain);

    GameController.mapTheObjective(base.elements.ctxMain);

    mapView.drawMap(base.elements.ctxMain);

    base.elements.canvasMain.height = screenHeight;
    base.elements.canvasMain.width = screenWidth;

    Connect.createPlayer(new Player(Connect.selfId));

    let x = 250;
    let y = 250;
    if(Connect.selfPlayer.team == 1)
    {
        x = 3750;
        y = 3750;
    }

    Connect.selfPlayer.x = x;
    Connect.selfPlayer.y = y;

    //runs the interval in 25 fps
    updateLoop = setInterval(Update, 1000 / 25);
  
};

const getRelativeXY = () => {
  let relativeX = screenWidth / 2 - Connect.selfPlayer.x;
  let relativeY = screenHeight / 2 - Connect.selfPlayer.y;

  const inBoundaryX =
    screenWidth / 2 < Connect.selfPlayer.x &&
    Connect.selfPlayer.x < CollisionSystem.mapSize.x - screenWidth / 2;
  const inBoundaryY =
    screenHeight / 2 < Connect.selfPlayer.y &&
    Connect.selfPlayer.y < CollisionSystem.mapSize.y - screenHeight / 2;

  if (inBoundaryX) {
    relativeX = screenWidth / 2 - Connect.selfPlayer.x;
  } else {
    if (Connect.selfPlayer.x < screenWidth / 2) relativeX = 0;
    else relativeX = screenWidth - CollisionSystem.mapSize.x;
  }

  if (inBoundaryY) {
    relativeY = screenHeight / 2 - Connect.selfPlayer.y;
  } else {
    if (Connect.selfPlayer.y < screenHeight / 2) relativeY = 0;
    else relativeY = screenHeight - CollisionSystem.mapSize.y;
  }
  return {
    x: relativeX,
    y: relativeY
  };
};

const Update = () => {
    if(Connect.isGameRunning)
    {
        if (Connect.selfPlayer) {
            if (Connect.selfPlayer.isDead) {
                Connect.createPlayer(null);
                //startState();
                respawnState();
                clearInterval(updateLoop);
            } else {
                GameController.Update();

                //console.log(GameController.objs[0].team0capture);

                let reltivitity = getRelativeXY();
                //get the input controls
                const controls = Control.getControl(
                    Connect.selfPlayer,
                    reltivitity.x,
                    reltivitity.y
                );

                //get the surrounding cells
                const cells = CollisionSystem.getSurroundingCell(Connect.selfPlayer);

                // updates movement and the angle
                Connect.selfPlayer.update(
                    controls.movement,
                    controls.angle,
                    controls.click,
                    cells
                );

                base.elements.ctxMain.clearRect(0, 0, screenWidth, screenHeight);
                //console.log(Connect.selfPlayer.obj);

                reltivitity = getRelativeXY();

                mapView.drawMap(base.elements.ctxMain, reltivitity.x, reltivitity.y);

                playerView.updateAmmoUI(Connect.selfPlayer);
                playerView.updateHealth(Connect.selfPlayer);
                playerView.updateScore(GameController.getTeam0Points(), GameController.getTeam1Points());
                if(Connect.selfPlayer.obj != -1 && Connect.selfPlayer.obj != 255)
                    playerView.updateObjScore(GameController.objs[Connect.selfPlayer.obj], Connect.selfPlayer.obj);
                //grid debug
                //mapView.drawGrid(base.elements.ctxMain);
                mapView.drawGridObj(base.elements.ctxMain, reltivitity.x, reltivitity.y);

                for (const i in Bullet.list) {
                    const bullet = Bullet.list[i];
                    //gets the cell to check for collision
                    //const cell = CollisionSystem.getCell(bullet.x - Connect.selfPlayer.x, bullet.y, Connect.selfPlayer.y);
                    //updates the bullet
                    bullet.update(CollisionSystem.getCell);
                    //draws the bullet
                    bulletView.drawBullet(
                    bullet,
                    base.elements.ctxMain,
                    reltivitity.x,
                    reltivitity.y
                    );
                }

                //draws the player in the canvas
                for (let id in Player.list) {
                    const player = Player.list[id];
                    playerView.drawPlayer(
                    player,
                    base.elements.ctxMain,
                    reltivitity.x,
                    reltivitity.y
                    );
                    //updates the grid
                    CollisionSystem.updateGridWithPlayer(player);
                }
            }
        }
    }else{
        Connect.createPlayer(null);
        clearInterval(updateLoop);
        scoreboardState();
    }
};



loginRegisterState();
//mainMenuState();
//scoreboardState();