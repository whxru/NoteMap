const { ipcRenderer } = require('electron')
const { buildMenu } = require('./build-menu');

function preChar(cm, curPos) {
    console.log(curPos);
    if(curPos === null) return null;

    var prePos = { line: curPos.line, ch: curPos.ch - 1};
    var line = cm.getLine(prePos.line);
    if(curPos.ch === 0) {
        if(prePos.line === 0) return null;
        line = cm.getLine(--prePos.line);
        prePos.ch = line.length - 1;
    }
    prePos.text = line[prePos.ch];
    console.log(prePos.text);
    return prePos;
}

module.exports = {
    buildEditor: () => {
        let noteTree = null;

        // Initialize the editor
        var editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
            lineNumbers: false,
            mode: "markdown"
        });
        editor.setSize('100vw', 'calc(100vh - 47px)');

        // Listen messages from main.js
        ipcRenderer.once('init-editor', (evt, info) => {
            document.querySelector('#title').innerHTML = `- ${info.title} -`
            buildMenu('edit', {
                editor: editor,
                noteInfo: info
            });
        })
        ipcRenderer.once('note-tree', (evt, nT) => {
            noteTree = nT;
        })

        editor.on('change', (cm, change) => {
            var curPos = change.from,
                prePos;
            if(change.text[0].endsWith(']') && (prePos=preChar(cm, curPos)).text==='[' && preChar(cm, prePos).text==='@') {
                // cm.addWidget()
                console.log('Prepare to select note');
            }
        })

    }
}