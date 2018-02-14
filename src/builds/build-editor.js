const { ipcRenderer } = require('electron')

module.exports = {
    buildEditor: () => {
        ipcRenderer.once('init-note', (evt, info) => {
            console.log(info);
            document.querySelector('#title').innerHTML = `- ${info.title} -`
        })
    }
}