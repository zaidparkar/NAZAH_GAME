export const elements = {
    canvasMain : document.querySelector("#ctx"),
    ctxMain : document.querySelector("#ctx").getContext("2d"),
    //LRpage elements
    lRPage : document.querySelector("#LRPage"),
    lRSignIn : document.querySelector('#LRSignIn'),
    lRRegister : document.querySelector('#LRRegister'),
    choosePage : document.querySelector("#ChooseTeam"),
    CTeamA: document.querySelector("#CTeamA"),
    CTeamB: document.querySelector("#CTeamB"),
    loginPage : document.querySelector("#LoginPage"),
    LSignIn: document.querySelector("#LSignIn"),
    LBack: document.querySelector("#LBack"),
    loginId: document.querySelector("#loginId"),
    loginPass: document.querySelector("#loginPass"),
    mainMenu : document.querySelector("#mainmenu"),
    mJoinGame : document.querySelector("#MJoinGame"),
    mOption : document.querySelector("#MOption"),
    register : document.querySelector("#registration"),
    registerId: document.querySelector("#registerId"),
    registerPass: document.querySelector("#registerPass"),
    registerPass2: document.querySelector("#registerPass2"),
    RSignIn : document.querySelector("#RSignIn"),
    RBack : document.querySelector("#RBack"),
    respawnPage : document.querySelector("#Respawn"),
    XRespawn : document.querySelector("#XRespawn"),
    XOption : document.querySelector("#XOption"),
    Playerui : document.querySelector('#playerui'),
    Bar1 : document.querySelector('#bar1'),
    Team1 : document.querySelector('#team1'),
    Time : document.querySelector('#time'),
    Bar2 : document.querySelector('#bar2'),
    Team2 : document.querySelector('#team2'),
    Ammo : document.querySelector('#ammo'),
    Health : document.querySelector('#health'),
    objectiveLetter : document.querySelector('#objectiveLetter'),
    objBar : document.querySelector('#objectivebar'),
    scoreboardPage : document.querySelector('#Scoreboard'),
    scb1 : document.querySelector('#scb1'),
    scb2 : document.querySelector('#scb2'),
    timer: document.querySelector('#timeAfterFinish'),
    ymainback : document.querySelector('#YMainMenu')
}






export const pathStrings = {
    trial: './img/spt/sp.png',
    map: './img/spt/Map.png',
    mapObj:'./img/spt/MapObj.png',
    redPlayer: './img/spt/Shooter Red.png',
    bluePlayer: './img/spt/Shooter Blue.png'
}



export const getImage = (src, width, height) => 
{
    const newImg = new Image(width,height);
    newImg.src = src;
    return newImg;
}
