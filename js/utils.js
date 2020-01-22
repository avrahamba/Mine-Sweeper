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
function copyBoard(board) {
    var res = [];
    for (var i = 0; i < board.length; i++) {
        res.push([]);
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            res[i].push({
                minesAroundCount: currCell.minesAroundCount,
                isShown: currCell.isShown,
                isMine: currCell.isMine,
                isMarked: currCell.isMarked
            })
        }
    }
    return res;
}
