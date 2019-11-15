export const elements = {
    canvasMain : document.querySelector("#ctx"),
    ctxMain : document.querySelector("#ctx").getContext("2d")
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
