const { ipcRenderer, clipboard } = require('electron');
const { preChar, nxtChar } = require('../editor/neighboring-char');
const buildMenu = require('./build-menu');
const NoteSelector = require('../editor/note-selector');
const path = require('path');
const addContent = require('../editor/add-content');

module.exports = () => {
    var noteTree = null;

    // Initialize the editor
    var editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
        lineNumbers: false,
        mode: "markdown"
    });
    editor.setSize('100vw', 'calc(100vh - 47px)');
    
    // Listen messages from main.js
    ipcRenderer.on('note-tree', (evt, nT) => {
        noteTree = nT;
    })
    ipcRenderer.once('init-editor', (evt, info) => {
        document.querySelector('#title').innerHTML = `- ${info.title} -`
        buildMenu('edit', {
            editor: editor,
            noteInfo: info
        });
    })

    editor.on('change', (cm, change) => {
        let curPos = change.from,
            prePos;
        // When '@[]' has been input
        if (change.text[0].endsWith(']')) {
            let prePos = preChar(cm, curPos),
                pre2Pos = preChar(cm, curPos, 2);
            if (prePos.text === '[' && pre2Pos.text === '@' && noteTree !== null) {
                var selector = new NoteSelector(noteTree);
                cm.addWidget(prePos, selector.element, true);
                selector.focus();
                // When a note has been chosed
                selector.on('selected', (guid, title) => {
                    ipcRenderer.send('get-in-app-link', guid);
                    ipcRenderer.once('in-app-link', (evt, inAppLink) => {
                        var linkStr = `[@${title}](${inAppLink})`;
                        cm.setSelection(prePos, nxtChar(cm, curPos));
                        cm.replaceSelection(linkStr);
                        var finalPos = pre2Pos;
                        for (let i = 0; i <= linkStr.length; i++) {
                            finalPos = nxtChar(cm, finalPos);
                        }
                        cm.focus();
                        // cm.setSelection(pre2Pos, finalPos);
                        cm.setSelection(pre2Pos, nxtChar(pre2Pos, linkStr.length + 1));
                    })
                });
                selector.on('removed', () => { cm.focus(); });
            }
        }
    })
    editor.on('paste', (cm, evt) => {
        var img = clipboard.readImage(),
            filepath = clipboard.read('FileNameW').replace(new RegExp(String.fromCharCode(0), 'g'), '') || clipboard.read('public.file-url').replace('file://', '');
        if (img.isEmpty() && filepath === "") return;
        
        console.log('Paste file or image!');
        evt.preventDefault();

        if (filepath !== "") {
            // File in the clipboard
            var { name } = path.parse(filepath);
            addContent(cm, `![${name}](${filepath})`);
        } else {
            // Image in the clipboard
            addContent(cm, `![](${img.toDataURL()})`);
        }
    })
}
