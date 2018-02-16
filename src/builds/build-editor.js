const { ipcRenderer } = require('electron')

module.exports = {
    buildEditor: () => {
        // Listen messages from main.js
        ipcRenderer.once('init-editor', (evt, info) => {
            document.querySelector('#title').innerHTML = `- ${info.title} -`
        })
        ipcRenderer.on('note-tree', (evt, noteTree) => {
            // to-do: store the noteTree.
        })

        // Initialize the editor
        var editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
            lineNumbers: false,
            mode: "markdown"
        });
        editor.setSize('100vw', 'calc(100vh - 47px)');
    }
}