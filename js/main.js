'use strict';

var gBoard;
var gLevel = null;
var gGame = null;
var gIntervalTime = null;
var gTimeStart;
var gDarkMode = false;
var gManuallyCreate = false;
var gManuallyCreated = false;
var gUndo = [];

const NORMAL = `&#x1F642;`;
const WIN = `&#x1F60D;`;
const LOST = `&#x1F62D;`;
const CLICK = `&#x1F62E;`;
const HINT = `&#x1F4A1;`;


function initGame(size, mine) {
    gUndo = [];
    gManuallyCreated = false;
    var elCss = document.querySelector('.css');
    elCss.href = (gDarkMode) ? 'css/styleDarkMode.css' : 'css/style.css';
    if (size) {
        gLevel = { size: size, mine: mine };
    }
    else if (!size && !gLevel) {
        gLevel = { size: 4, mine: 2 };
    }
    var elImuji = document.querySelector('.imuji');
    elImuji.innerHTML = NORMAL;

    var elTime = document.querySelector('.time');
    elTime.innerText = 0;



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
    renderBoard(gBoard);
    if (gIntervalTime) clearInterval(gIntervalTime);
    gTimeStart = false;
    var elMinesScreen = document.querySelector('.mines-screen');
    elMinesScreen.innerText = gLevel.mine;
    var elLive = document.querySelector('.live');
    elLive.innerText = gGame.live;
    var bestSorce = localStorage.bestSorce;
    if (localStorage.bestSorce) {
        var elBestSorce = document.querySelector('.best-sorce');
        elBestSorce.innerText = bestSorce / 1000;
    }
    var elSafeClick = document.querySelector('.safe-click');
    elSafeClick.innerText = `safe click: ${gGame.safeClick}`;
    var strHtml = '';
    for (var i = 0; i < gGame.hints; i++) {
        strHtml += HINT;
    }
    var elHint = document.querySelector('.hints');
    elHint.innerHTML = strHtml;
}

function renderTime() {
    if (!gTimeStart) gTimeStart = Date.now();
    var time = new Date(Date.now() - gTimeStart);
    var elTime = document.querySelector('.time');
    elTime.innerText = Math.floor(time / 1000);
}
function darkMode() {
    gDarkMode = !gDarkMode;
    var elCss = document.querySelector('.css');
    elCss.href = (gDarkMode) ? 'css/styleDarkMode.css' : 'css/style.css';
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
    res += `<td onclick="cellClick(this)" oncontextmenu="cellMarked(this)" onmouseout="outHint(this)" onmouseover="hoverHint(this)" data-coord="cell-${location.i}-${location.j}">`

    if (currCell.isMine) res += `<img class="mine" src="img/mine.png">`;
    else if (currCell.minesAroundCount) res += `<span class="num n${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`;
    if (!currCell.isShown) res += `<div class="caver"></div>`;
    res += `</td>`;
    return res;
}

function renderCell(board, location) {
    var currCell = board[location.i][location.j];
    var res = ``;

    if (currCell.isMine) res += `<img class="mine ${(!currCell.isShown) ? 'mine-caver' : ''}" src="img/mine.png">`;
    else if (currCell.minesAroundCount) res += `<span class="num n${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`;
    if (!currCell.isShown) res += `<div class="caver ${(currCell.isMarked) ? 'mark' : ''}"></div>`;
    return res;
}
function safeClick(elSafeClick) {
    if (gGame.start) return;
    gGame.safeClick--;
    elSafeClick.innerText = `safe click: ${gGame.safeClick}`;
    var coords = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                coords.push({ i: i, j: j });
            }
        }
    }
    var currCoord = coords[getRandomIntInclusive(0, coords.length - 1)];
    var elCellCaver = coordToEl(currCoord).querySelector('.caver');
    elCellCaver.classList.add('safe');
    setTimeout(function () { elCellCaver.classList.remove('safe'); }, 300)
}
function cellClick(elCell) {
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
    gBoard[coord.i][coord.j].isShown = true;
    elCell.innerHTML = renderCell(gBoard, coord);
    if (!gBoard[coord.i][coord.j].minesAroundCount) expandShown(gBoard, coord);
    checkGameOver();
    undo.push({ action: false, coord: coord });
}
function cellMarked(elCell) {
    var coord = elTdToCoord(elCell)
    if (gBoard[coord.i][coord.j].isShown) return;
    if (!gBoard[coord.i][coord.j].isMarked) gGame.markedCount++;
    else gGame.markedCount--;
    gBoard[coord.i][coord.j].isMarked = !gBoard[coord.i][coord.j].isMarked;
    elCell.innerHTML = renderCell(gBoard, coord);
    checkGameOver();
    var elMinesScreen = document.querySelector('.mines-screen');
    elMinesScreen.innerText = gLevel.mine - gGame.markedCount;
    undo.push({ action: false, coord: coord });
}

function checkGameOver() {
    var win = true;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMarked && gBoard[i][j].isMine) win = false;
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) win = false;
            if (gBoard[i][j].isShown && gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                gGame.live--;
                var elLive = document.querySelector('.live');
                elLive.innerText = gGame.live;
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
            var bestSorce = localStorage.bestSorce;
            if (bestSorce > time) {
                localStorage.bestSorce = +time;
            }
        }

        var elImuji = document.querySelector('.imuji');
        elImuji.innerHTML = WIN;
        gGame.isOn = false;
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
