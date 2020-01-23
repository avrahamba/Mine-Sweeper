'use strict';

var gBoard;
var gLevel = null;
var gGame = null;
var gIntervalTime = null;
var gTimeStart;
var gDarkMode = false;
var gManuallyCreate = false;
var gManuallyCreated = false;
var gUndoList = [];
var gMiddleModeButton = false;

const NORMAL = `&#x1F642;`;
const WIN = `&#x1F60D;`;
const LOST = `&#x1F62D;`;
const CLICK = `&#x1F62E;`;
const HINT = `&#x1F4A1;`;
const SAFE = '&#x1F9BA;';
const LIVE = '❤️'
const MIDDLE_MODE = '😯';

function initGame(size, mine) {
    gManuallyCreated = false;
    if (size) {
        gLevel = { size: size, mine: mine };
        var elCssSize = document.querySelector('.css3');
        switch (size) {
            case 4:
                elCssSize.href = 'css/size1.css';
                break;
            case 8:
                elCssSize.href = 'css/size2.css';
                break;
            case 12:
                elCssSize.href = 'css/size3.css';
                break;
        }
    }
    else if (!size && !gLevel) {
        gLevel = { size: 4, mine: 2 };
    }

    gBoard = buildBoard();
    window.oncontextmenu = function () {
        return false; // cancel default menu
    }
    gGame = {
        start: true,
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        live: 3,
        safeClick: 3,
        hints: 3
    }
    startPlay();
    renderBoard(gBoard);
}

function startPlay() {
    gUndoList = [];

    var elCss = document.querySelector('.css');
    var href = elCss.href;
    if (href !== ((gDarkMode) ? 'css/styleDarkMode.css' : 'css/lightModestyle.css')) {
        elCss.href = (gDarkMode) ? 'css/styleDarkMode.css' : 'css/lightModestyle.css';
    }

    var elImuji = document.querySelector('.imuji');
    elImuji.innerHTML = NORMAL;

    var elTime = document.querySelector('.time span');
    elTime.innerText = 0;

    if (gIntervalTime) clearInterval(gIntervalTime);
    gTimeStart = false;

    var bestSorce = localStorage.bestSorce;
    if (localStorage.bestSorce) {
        var elBestSorce = document.querySelector('.best-sorce span');
        elBestSorce.innerText = bestSorce / 1000;
    }

    var elMinesScreen = document.querySelector('.mines-screen span');
    elMinesScreen.innerText = gLevel.mine;

    var strHtml = '';
    for (var i = 0; i < gGame.live; i++) {
        strHtml += LIVE;
    }
    var elLive = document.querySelector('.live');
    elLive.innerHTML = strHtml;

    var elSafeClick = document.querySelector('.safe-click');
    strHtml = '';
    for (var i = 0; i < gGame.safeClick; i++) {
        strHtml += SAFE;
    }
    elSafeClick.innerHTML = strHtml;

    strHtml = '';
    for (var i = 0; i < gGame.hints; i++) {
        strHtml += HINT;
    }
    var elHint = document.querySelector('.hints');
    elHint.innerHTML = strHtml;
}

function darkMode() {
    gDarkMode = !gDarkMode;
    var elCss = document.querySelector('.css');
    elCss.href = (gDarkMode) ? 'css/styleDarkMode.css' : 'css/lightModestyle.css';
}
function buildBoard() {
    var res = [];
    for (var i = 0; i < gLevel.size; i++) {
        res.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            res[i].push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            })
        }
    }
    return res;
}

function calcBoard(board, level, location) {
    var locations = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if ((i >= location.i - 1 && i <= location.i + 1) &&
                (j >= location.j - 1 && j <= location.j + 1)) {
                continue;
            }
            locations.push({ i: i, j: j })
        }
    }
    for (var i = 0; i < level.mine; i++) {
        var currLocation = locations.splice(getRandomIntInclusive(0, locations.length - 1), 1)[0];
        board[currLocation.i][currLocation.j].isMine = true;
        addMineAround(board, currLocation);
    }
}

function addMineAround(board, location, remove = false) {
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board[0].length) continue;
            if (remove)
                board[i][j].minesAroundCount--;
            else
                board[i][j].minesAroundCount++;
        }
    }
}

function expandShown(board, coord) {

    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board[0].length) continue;
            if (i === coord.i && j === coord.j) continue;
            if (gBoard[i][j].isShown) continue;
            var elCell = coordToEl({ i: i, j: j });
            cellClick(elCell, true);
        }
    }

}

function cellClick(elCell, rec = false) {
    if (gManuallyCreate) {
        cellClickManuallyCreate(elCell);
        return;
    }
    if (gHintMode) {
        hintClick(elCell);
        return;
    }
    var coord = elTdToCoord(elCell);
    if (!gGame.isOn) return;
    if (gBoard[coord.i][coord.j].isShown) return;
    if (gBoard[coord.i][coord.j].isMarked) return;
    if (gGame.start) {
        gIntervalTime = setInterval(renderTime, 100)
        if (!gManuallyCreated) {
            calcBoard(gBoard, gLevel, coord);
        }
        gGame.start = false;
    }
    if (!rec) {
        gUndoList.push({
            board: copyBoard(gBoard),
            live: gGame.live,
            safeClick: gGame.safeClick,
            hints: gGame.hints
        });
    }
    gBoard[coord.i][coord.j].isShown = true;
    elCell.innerHTML = renderCell(gBoard, coord);
    if (!gBoard[coord.i][coord.j].minesAroundCount) expandShown(gBoard, coord);
    checkGameOver();
}
function cellMarked(elCell) {
    if(!gGame.isOn)return;
    var coord = elTdToCoord(elCell)
    if (gBoard[coord.i][coord.j].isShown) return;
    gUndoList.push({
        board: copyBoard(gBoard),
        live: gGame.live,
        safeClick: gGame.safeClick,
        hints: gGame.hints
    });
    if (!gBoard[coord.i][coord.j].isMarked) gGame.markedCount++;
    else gGame.markedCount--;
    gBoard[coord.i][coord.j].isMarked = !gBoard[coord.i][coord.j].isMarked;
    elCell.innerHTML = renderCell(gBoard, coord);
    checkGameOver();
    var elMinesScreen = document.querySelector('.mines-screen span');
    elMinesScreen.innerText = gLevel.mine - gGame.markedCount;
}

function checkGameOver() {
    var win = true;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMarked && gBoard[i][j].isMine) win = false;
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) win = false;
            if (gBoard[i][j].isShown && gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                gGame.live--;

                var strHtml = '';
                for (var k = 0; k < gGame.live; k++) {
                    strHtml += LIVE;
                }
                var elLive = document.querySelector('.live');
                elLive.innerHTML = strHtml;
                gBoard[i][j].isMarked = true;
                if (gGame.live < 1) {
                    clearInterval(gIntervalTime);
                    var elImuji = document.querySelector('.imuji');
                    elImuji.innerHTML = LOST;
                    gGame.isOn = false;

                    for (var i = 0; i < gBoard.length; i++) {
                        for (var j = 0; j < gBoard[0].length; j++) {
                            if (!gBoard[i][j].isShown && gBoard[i][j].isMine) {
                                gBoard[i][j].isShown = true;
                                var elCell = coordToEl({ i: i, j: j });
                                elCell.innerHTML = renderCell(gBoard, { i: i, j: j });
                            }

                        }
                    }
                    return;
                } else {
                    checkGameOver()
                    return;
                }
            }
        }
    }
    if (win) {
        clearInterval(gIntervalTime);
        var time = new Date(Date.now() - gTimeStart);
        if (!localStorage.bestSorce) {
            localStorage.bestSorce = +time;
        } else {
            var bestSorce = +localStorage.bestSorce;
            if (bestSorce > time) {
                localStorage.bestSorce = +time;
            }
        }

        var elImuji = document.querySelector('.imuji');
        elImuji.innerHTML = WIN;
        gGame.isOn = false;
    }
}
