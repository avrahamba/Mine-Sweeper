'use strict';

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            strHtml += renderCellStr(board, { i, j });

        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHtml;
}

function renderCellStr(board, location) {
    var currCell = board[location.i][location.j];
    var res = ``;
    res += `<td onclick="cellClick(this)" onmousedown="mouseOnMiddle(this,event)" nomouseup="mouseUpMiddle()" onmouseout="mouseOutMiddle(this)" onmouseover="mouseOverMiddle(this)" oncontextmenu="cellMarked(this)" onmouseout="outHint(this)" onmouseover="hoverHint(this)" data-coord="cell-${location.i}-${location.j}">`

    if (currCell.isMine) res += `<img class="mine ${(!currCell.isShown) ? 'mine-cover' : ''}" src="img/mine.png">`;
    else if (currCell.minesAroundCount && currCell.isShown) res += `<span class="num n${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`;
    if (!currCell.isShown) res += `<div class="cover ${(currCell.isMarked) ? 'mark' : ''}"></div>`;
    res += `</td>`;
    return res;
}

function renderCell(board, location) {
    var currCell = board[location.i][location.j];
    var res = ``;

    if (currCell.isMine) res += `<img class="mine ${(!currCell.isShown) ? 'mine-cover' : ''}" src="img/mine.png">`;
    else if (currCell.minesAroundCount && currCell.isShown) res += `<span class="num n${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`;
    if (!currCell.isShown) res += `<div class="cover ${(currCell.isMarked) ? 'mark' : ''}"></div>`;
    return res;
}
function renderTime() {
    if (!gTimeStart) gTimeStart = Date.now();
    var time = new Date(Date.now() - gTimeStart);
    var elTime = document.querySelector('.time span');
    elTime.innerText = Math.floor(time / 1000);
}
