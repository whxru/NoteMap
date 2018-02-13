const url = require('url');
const path = require('path');
const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
    if (mainWindow) return;

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        hasShadow: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if(process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

});

app.on('window-all-closed', () => {});
