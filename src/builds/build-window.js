function activateCloseBtn(win) {
    document.getElementById('close').onclick = evt => {
        win.close();
    };
}

function activateMinBtn(win) {
    document.getElementById('min').onclick = evt => {
        win.minimize();
    };
}

function activateMaxBtn(win) {
    document.getElementById('max').onclick = evt => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else{
            win.maximize();   
        };
    };
}

module.exports = () => {
    let win = require('electron').remote.getCurrentWindow();
    activateMinBtn(win);
    activateMaxBtn(win);
    activateCloseBtn(win);
    // Open DevTools in development environment
    if (process.env.NODE_ENV === 'development') {
        win.openDevTools();
    }
}
