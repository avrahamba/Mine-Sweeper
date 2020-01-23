'use strict';

var gMinesCount = 0;
function manuallyCreate() {
    var elManuallyCreate = document.querySelector('.manually-create');
    var elCss = document.querySelector('.css2');
    if (gManuallyCreate) {
        elManuallyCreate.innerHTML = '<img src="img/gear.png">';
        elCss.href = '';
        gManuallyCreated = true;
        gLevel.mine = gMinesCount;
        gGame.live = 3;
        gGame.safeClick = 3;
        gGame.hints = 3;
        gGame.isOn = true;
        startPlay();

    } else {

        gGame.markedCount = 0;
        gMinesCount = 0;
        elManuallyCreate.innerText = 'start game';
        elCss.href = 'css/manuallyCreate.css';

        gBoard = buildBoard();
        renderBoard(gBoard)
    }
    gManuallyCreate = !gManuallyCreate;
}



function cellClickManuallyCreate(elCell) {
    var coord = elTdToCoord(elCell);
    if (!gBoard[coord.i][coord.j].isMine) {
        addMineAround(gBoard, coord);
        gMinesCount++;
    } else {
        addMineAround(gBoard, coord, true);
        gMinesCount--;
    }
    gBoard[coord.i][coord.j].isMine = !gBoard[coord.i][coord.j].isMine;
    elCell.innerHTML = renderCell(gBoard, coord);
}