const { ipcRenderer } = require('electron');

module.exports = {
    template: (account) => {
        return [
            {
                icon: "exit_to_app",
                label: "返回",
                click: () => { $('.button-collapse').sideNav('hide'); }
            }
        ]
    }
}