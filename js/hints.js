'use strict';

var gHintMode = false;

function hint(elHint) {
    if (gGame.hints < 1 || gGame.start) return;
    gGame.hints--;
    var strHtml = '';
    for (var i = 0; i < gGame.hints; i++) {
        strHtml += HINT;
    }
    elHint.innerHTML = strHtml;
    gHintMode = true;

}

function hintClick(elCell) {
    outHint(elCell);
    gHintMode = false;
    var coord = elTdToCoord(elCell);
    hintClickAction(coord, true);
    setTimeout(function () {
        hintClickAction(coord, false);
    }, 300)
}

function hintClickAction(coord, open) {
    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            var currEl = coordToEl({ i: i, j: j })
            currEl.innerHTML = renderCell(gBoard, { i: i, j: j });
            var cover = currEl.querySelector('.cover');
            if (cover) {
                if (open) cover.classList.add('hiden');
                else cover.classList.remove('hiden');
            }
            var elMine = currEl.querySelector('.mine');
            if (elMine) {
                if (open) elMine.classList.remove('mine-cover');
                else elMine.classList.add('mine-cover');
            }
        }
    }
}

function hoverHint(elCell) {
    if (!gHintMode) return;
    var coord = elTdToCoord(elCell);
    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            var currEl = coordToEl({ i: i, j: j })
            currEl.classList.add('safe')
        }
    }


}

function outHint(elCell) {
    if (!gHintMode) return;
    var coord = elTdToCoord(elCell);

    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            var currEl = coordToEl({ i: i, j: j })
            currEl.classList.remove('safe')
        }
    }

}
function safeClick(elSafeClick) {
    if (gGame.start) return;
    gGame.safeClick--;
    var strHtml = '';
    for (var i = 0; i < gGame.safeClick; i++) {
        strHtml += SAFE;
    }
    elSafeClick.innerHTML = strHtml;    var coords = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                coords.push({ i: i, j: j });
            }
        }
    }
    var currCoord = coords[getRandomIntInclusive(0, coords.length - 1)];
    var elCellCaver = coordToEl(currCoord).querySelector('.cover');
    elCellCaver.classList.add('safe');
    setTimeout(function () { elCellCaver.classList.remove('safe'); }, 300)
}
