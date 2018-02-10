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

function makeWindowMovable(win) {
    var nav = document.getElementsByTagName('nav')[0];
    var x_win, y_win, x_mouse, y_mouse;
    var move = false;

    nav.onmousedown = evt => {
        x_win = win.getBounds().x;
        y_win = win.getBounds().y;
        x_mouse = evt.screenX;
        y_mouse = evt.screenY;
        move = true;
    }
    
    nav.onmousemove = evt => {
        if(!move) return;
        
        deltaX = evt.screenX - x_mouse;
        deltaY = evt.screenY - y_mouse;
        x_win += deltaX;
        y_win += deltaY;
        
        width = win.getBounds().width;
        height = win.getBounds().height;
        win.setBounds({
            x: x_win, y:y_win, width: width, height: height
        });
        
        x_mouse = evt.screenX;
        y_mouse = evt.screenY;
    };

    nav.onmouseup = evt => {
        move = false;
    }
}

module.exports = {
    buildWindow: () => {
        let win = require('electron').remote.getCurrentWindow();
        bindMinBtn(win);
        bindMaxBtn(win);
        bindCloseBtn(win);
        makeWindowMovable(win);
    }
}