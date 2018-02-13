const url = require('url');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { accessAccount } = require('./utils/access-account');

let mainWindow, account;

app.on('ready', () => {
    if (mainWindow) return;

    // Access user's account
    account = accessAccount();

    // Handle messages
    initMessages();

    // Open index page
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

    // Open DevTools in development environment
    if(process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools();
    }

    // Delete objects
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

});

function initMessages() {
    ipcMain.on('get-all-notes', evt => {
        account.getAllNotes().then(notes => {
            evt.sender.send('all-notes', notes);
        })
    })
}