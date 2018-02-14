const { ipcRenderer } = require('electron');

module.exports = {
    template: (account) => {
        return [
            {
                icon: "add",
                label: "创建笔记",
                click: () => {
                    ipcRenderer.send('click-create-note');
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