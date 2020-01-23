'use strict';



function bodyOnKey(ev) {
    if (ev.ctrlKey && ev.key === 'z')
        undo();
}

function undo() {
    var undoUnit = gUndoList.pop();
    gBoard = undoUnit.board;
    renderBoard(gBoard)

    gGame.markedCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked) gGame.markedCount++;
        }
    }
    var elMinesScreen = document.querySelector('.mines-screen span');
    elMinesScreen.innerText = gLevel.mine - gGame.markedCount;

    var strHtml = '';
    if (gGame.live !== undoUnit.live) {
        gGame.live = undoUnit.live;
        for (var k = 0; k < gGame.live; k++) {
            strHtml += LIVE;
        }
        var elLive = document.querySelector('.live');
        elLive.innerHTML = strHtml;
    }
    if (gGame.safeClick !== undoUnit.safeClick) {
        gGame.safeClick = undoUnit.safeClick;
        strHtml = '';
        for (var i = 0; i < gGame.safeClick; i++) {
            strHtml += SAFE;
        }
        var elSafeClick = document.querySelector('.safe-click');
        elSafeClick.innerHTML = strHtml;
    }
    if (gGame.hints !== undoUnit.hints) {
        gGame.hints = undoUnit.hints;
        for (var i = 0; i < gGame.hints; i++) {
            strHtml += HINT;
        }
        var elHint = document.querySelector('.hints');
        elHint.innerHTML = strHtml;
    }

}