module.exports = {
    menuTemplate: (account) => {
        return [
            {
                icon: "filter_drama",
                label: "MENUITEM 1",
                submenu: [
                    {
                        icon: "access_alarm",
                        label: "Alarm",
                        click: () => {
                            console.log("Alarm!");
                            $('.button-collapse').sideNav('hide');
                        }
                    },
                    {
                        icon: "adb",
                        label: "Debug",
                        click: () => { $('.button-collapse').sideNav('hide'); }
                    }

                ]
            },
            {
                icon: "archive",
                label: "MENUITEM 2",
                click: () => { $('.button-collapse').sideNav('hide'); }
            },
            "Divider",
            {
                icon: "attach_file",
                label: "MENUITEM 3",
                click: () => { $('.button-collapse').sideNav('hide'); }
            }
        ]
    }
}