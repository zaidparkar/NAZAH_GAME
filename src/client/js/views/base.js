export const elements = {
    canvasMain : document.querySelector("#ctx"),
    ctxMain : document.querySelector("#ctx").getContext("2d"),
    //LRpage elements
    lRPage : document.querySelector("#LRPage"),
    lRSignIn : document.querySelector('#LRSignIn'),
    lRRegister : document.querySelector('#LRRegister'),
    choosePage : document.querySelector("#ChooseTeam"),
    loginPage : document.querySelector("#LoginPage"),
    mainMenu : document.querySelector("#mainmenu"),
    register : document.querySelector("#registration"),
    respawnPage : document.querySelector("#Respawn"),
    mJoinGame : document.querySelector("#MJoinGame")

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
