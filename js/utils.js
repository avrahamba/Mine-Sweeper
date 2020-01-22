'use strict';

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elTdToCoord(el) {
    var coord = el.dataset['coord'];
    return { i: +coord.split('-')[1], j: +coord.split('-')[2] };
}

function coordToEl(coord) {
    var strCoord = `cell-${coord.i}-${coord.j}`
    var res = document.querySelector(`[data-coord="${strCoord}"]`);
    return res;
}