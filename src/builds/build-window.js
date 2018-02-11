function bindCloseBtn(win) {
    document.getElementById('close').onclick = evt => {
        win.close();
    };
}

function bindMinBtn(win) {
    document.getElementById('min').onclick = evt => {
        win.minimize();
    };
}

function bindMaxBtn(win) {
    document.getElementById('max').onclick = evt => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else{
            win.maximize();   
        };
    };
}

module.exports = {
    buildWindow: () => {
        let win = require('electron').remote.getCurrentWindow();
        bindMinBtn(win);
        bindMaxBtn(win);
        bindCloseBtn(win);
    }
}