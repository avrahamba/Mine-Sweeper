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
    var startI = coord.i - 1;
    var endI = coord.i + 1;
    var startJ = coord.j - 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
            var currEl = coordToEl({ i: i, j: j })
            currEl.innerHTML = renderCell(gBoard, { i: i, j: j });
            var caver = currEl.querySelector('.caver');
            if (caver) {
                caver.classList.add('hiden')
                setTimeout(function () { if (caver) caver.classList.remove('hiden'); }, 300);
            }
            var elMine = currEl.querySelector('.mine');
            if (elMine) elMine.classList.remove('mine-caver');
        }
    }
    setTimeout(function () {

        for (var i = startI; i <= endI; i++) {
            for (var j = startJ; j <= endJ; j++) {
                if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[0].length) continue;
                var currEl = coordToEl({ i: i, j: j })
                currEl.innerHTML = renderCell(gBoard, { i: i, j: j });
                var caver = currEl.querySelector('.caver');
                if (caver) {
                    caver.classList.remove('hiden')
                }
                var elMine = currEl.querySelector('.mine');
                if (elMine) elMine.classList.remove('mine-caver');
            }
        }
    }, 300)

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
