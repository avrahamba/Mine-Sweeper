'use strict';

var gCoordMiddleButton = null;

function endMiddleButton() {
    gMiddleModeButton = false;
    var elImuji = document.querySelector('.imuji');
    elImuji.innerHTML = NORMAL;
    var els = document.querySelectorAll('.cover-chack');
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('cover-chack');
    }
    if (gGame.start) return;
    if (gManuallyCreated) return;
    if (!gCoordMiddleButton) return;
    var coord = gCoordMiddleButton;
    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    var countMarked = 0;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMarked) {
                countMarked++;
            }
        }
    }
    if (countMarked === gBoard[coord.i][coord.j].minesAroundCount) {

        for (var i = startI; i <= endI; i++) {
            for (var j = startJ; j <= endJ; j++) {
                if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
                if (gBoard[i][j].isShown) continue;
                cellClick(coordToEl({ i: i, j: j }))
            }
        }
    }
    gCoordMiddleButton = null;
}

function startMiddleButton() {
    var elImuji = document.querySelector('.imuji');
    elImuji.innerHTML = MIDDLE_MODE;
    gMiddleModeButton = true;
}
function mouseOnMiddle(el, ev) {
    if (ev.buttons !== 4) return;
    if (!gGame.isOn) return;
    startMiddleButton();
    window.addEventListener('mouseup', endMiddleButton, false);
    mouseOverMiddle(el);
}
function middleButton(ev) {
    if (ev.buttons !== 4) return;
    if (!gGame.isOn) return;
    startMiddleButton();
    window.addEventListener('mouseup', endMiddleButton, false);
}

function mouseUpMiddle() {
    if (!gMiddleModeButton) return;

}

function mouseOverMiddle(elCell) {
    if (!gMiddleModeButton) return;
    var coord = elTdToCoord(elCell);
    toggleNug(coord);
    gCoordMiddleButton = coord;
}

function mouseOutMiddle(elCell) {
    if (!gMiddleModeButton) return;
    var coord = elTdToCoord(elCell);
    toggleNug(coord);
    gCoordMiddleButton = null;
}

function toggleNug(coord) {
    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            if (gBoard[i][j].isShown) continue;
            var elCellNug = coordToEl({ i: i, j: j });
            if (elCellNug.querySelector('.cover:not(.mark)')) {
                elCellNug.querySelector('.cover:not(.mark)').classList.toggle('cover-chack');
            }
        }
    }

}