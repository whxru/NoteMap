const url = require('url');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const accessAccount = require('./evernote/access-account');
const md2enml = require('./editor/markdown-to-enml');

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

    ipcMain.on('get-in-app-link', (evt, guid) => {
        account.getInAppLink(guid).then(inAppLink => {
            evt.sender.send('in-app-link', inAppLink);
        });
    })

    ipcMain.on('click-create-note', evt => {
        // Open an edit page
        var win = new BrowserWindow({
            width: 600,
            height: 900,
            frame: false,
            hasShadow: true,
            parent: mainWindow
        });
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'pages/edit.html'),
            protocolo: 'file:',
            slashes: true
        }));

        win.webContents.on('did-finish-load', () => {
            account.getNoteTree().then(noteTree => {
                win.webContents.send('note-tree', noteTree);
            })
            win.webContents.send('init-editor', {
                title: 'New Note',
                content: '',
                notebook: {
                    name: "",
                    guid: ""
                },
                readOnly: false
            })
        })
    })

    ipcMain.on('create-note', (evt, editorContent) => {
        var { title, content, resources } = md2enml(editorContent);
        account.createNote(title, content, resources).then(note => { console.log(note); }).catch(reason => { console.log(reason); });
    })
}