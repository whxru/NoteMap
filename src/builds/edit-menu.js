const { ipcRenderer } = require('electron');

module.exports = {
    template: ({editor, noteInfo}) => {
        return [
            {
                icon: "save",
                label: "保存",
                click: () => {
                    if(noteInfo['readOnly']) return;
                    
                    if(noteInfo['notebook']['guid'] === '') {
                        // Create new note
                        ipcRenderer.send('create-note', editor.getValue());
                    } else {
                        // Update existed note
                    }

                    $('.button-collapse').sideNav('hide');
                }
            },
            "Divider",
            {
                icon: "exit_to_app",
                label: "返回",
                click: () => { $('.button-collapse').sideNav('hide'); }
            }
        ]
    }
}