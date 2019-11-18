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
    mainMenu : document.querySelector("#mainmenu"),
    mJoinGame : document.querySelector("#MJoinGame"),
    mOption : document.querySelector("#MOptions"),
    register : document.querySelector("#registration"),
    RSignIn : document.querySelector("#RSignIn"),
    RBack : document.querySelector("#RBack"),
    respawnPage : document.querySelector("#Respawn"),
    XRespawn : document.querySelector("#XRespawn"),
    XOption : document.querySelector("#XOption"),



}






export const pathStrings = {
    trial: './img/spt/sp.png',
    map: './img/spt/Map.png',
    mapObj:'./img/spt/MapObj.png'
}



export const getImage = (src, width, height) => 
{
    const newImg = new Image(width,height);
    newImg.src = src;
    return newImg;
}
