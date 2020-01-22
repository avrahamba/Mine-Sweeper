'use strict';



function bodyOnKey(ev) {
    if (ev.ctrlKey && ev.key === 'z')
        undo();
}

function undo() {
    gBoard = gUndoList.pop();
    renderBoard(gBoard)
}