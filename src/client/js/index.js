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

const mapwidth = CollisionSystem.mapSize.x;
const mapheight = CollisionSystem.mapSize.y;

const screenWidth = document.documentElement.clientWidth - 15;
const screenHeight = document.documentElement.clientHeight - 15;

let updateLoop;

const spawnInterval = () => {
  const interval = setInterval(() => {
    if (Control.canSpawn()) {
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

  //listen for the intervals
  const eventInterval = setInterval(() => {
    if (Control.getJoinGame()) {
      Control.setJoinGame(false);
      Control.setSpawn(true);
      clearInterval(eventInterval);
      startState();
    }
  }, 40);
};

const startState = () => {
  base.elements.mainMenu.style.display = "none";
  base.elements.canvasMain.style.display = "block";
  base.elements.Playerui.style.display = "block";

  base.elements.canvasMain.height = screenHeight;
  base.elements.canvasMain.width = screenWidth;

  base.elements.ctxMain.clearRect(0, 0, screenWidth, screenHeight);

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
  if (Connect.selfPlayer) {
    if (Connect.selfPlayer.isDead) {
      Connect.createPlayer(null);
      startState();
      Control.setSpawn(false);
      clearInterval(updateLoop);
    } else {
      GameController.Update();

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
      //grid debug
      //mapView.drawGrid(base.elements.ctxMain);
      //mapView.drawGridObj(base.elements.ctxMain, reltivitity.x, reltivitity.y);

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
};

loginRegisterState();
//mainMenuState();
