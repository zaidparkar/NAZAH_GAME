import * as base from './base';


export const drawScoreboard = (data) => {
    const board1 = base.elements.scb1;

    clearChildren(board1);
    for(let i = 0; i< data.length; i++)
    {
        let html = `<td class="scbname">${data[i].id}</td><td>${data[i].Kills}</td> <td>${data[i].Deaths}</td>`
        board1.insertAdjacentHTML("beforeend", html);
    }
}

const clearChildren = (element) => {

    while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
}