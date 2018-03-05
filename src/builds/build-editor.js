const { ipcRenderer } = require('electron');
const { buildMenu } = require('./build-menu');
const { NoteSelector } = require('../utils/note-selector');
const { preChar, nxtChar } = require('../utils/neighboring-char');

module.exports = {
    buildEditor: () => {
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
            if(change.text[0].endsWith(']')) {
                let prePos = preChar(cm, curPos),
                    pre2Pos = preChar(cm, curPos, 2);
                if(prePos.text === '[' && pre2Pos.text === '@' && noteTree !== null) {
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
                            cm.setSelection(pre2Pos, finalPos);
                        })
                    });
                    selector.on('removed', () => { cm.focus(); });
                }
            }
        })

    }
}