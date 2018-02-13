const { BrowserWindow } = require('electron').remote;

module.exports = {
    template: (account) => {
        return [
            {
                icon: "add",
                label: "创建笔记",
                click: () => { $('.button-collapse').sideNav('hide'); }
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