'use strict';

var gMinesCount = 0;
function manuallyCreate() {
    var elManuallyCreate = document.querySelector('.manually-create');
    var elCss = document.querySelector('.css');
    if (gManuallyCreate) {
        var elCss = document.querySelector('.css');

        elCss.href = (gDarkMode) ? 'css/styleDarkMode.css' : 'css/style.css';
        gManuallyCreated = true;
        gLevel.mine = gMinesCount;
        gGame.live = 3;
        gGame.safeClick = 3;
        gGame.hints = 3;
        var strHtml = '';
        for (var i = 0;i< gGame.hints; i++) {
            strHtml += HINT;
        }
        var elHint = document.querySelector('.hints');
        elHint.innerHTML = strHtml;    
        var elSafeClick = document.querySelector('.safe-click');
        elSafeClick.innerText = `safe click: ${gGame.safeClick}`;
        gGame.isOn = true;
        var elLive = document.querySelector('.live');
        elLive.innerText = gGame.live;
        var elMinesScreen = document.querySelector('.mines-screen');
        elMinesScreen.innerText = gLevel.mine;
        gUndo = [];

    } else {
        if (gIntervalTime) clearInterval(gIntervalTime);
        gTimeStart = false;

        gGame.markedCount = 0;
        gMinesCount = 0;
        elManuallyCreate.innerText = 'manually create';
        var elImuji = document.querySelector('.imuji');
        var elTime = document.querySelector('.time');
        elTime.innerText = 0;


        elImuji.innerHTML = NORMAL;
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