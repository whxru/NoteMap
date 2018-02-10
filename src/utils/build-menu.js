function buildFromTemplate(root, template) {
    template.forEach(item => {
        if(item === "Divider") {
            addDivider(root);
            return;
        }

        var cradle = addMenuItem(root, item);
        if("submenu" in item) buildFromTemplate(cradle, item.submenu);
    });
}

function addMenuItem(root, menuItem) {
    var ul = document.createElement('ul');
    ul.className = 'collapsible';
    ul.setAttribute('data-collapsible', 'accordion');
    root.appendChild(ul);
    ul.innerHTML = `
        <li>
            <div class="collapsible-header waves-effect waves-light"><i class="material-icons">${menuItem.icon}</i>${menuItem.label}</div>
            <div class="collapsible-body"><span></span></div>
        </li>
    `
    if('click' in menuItem) ul.querySelector('.collapsible-header').onclick = menuItem.click;


    return ul.querySelector('span');
}

function addDivider(root) {
    var divider = document.createElement('li');
    divider.innerHTML = `<div class="divider"></div>`;
    root.appendChild(divider);
}

module.exports = {
    buildMenu: account => {
        $('#menu-btn').sideNav();
        buildFromTemplate(document.querySelector("#slide-out"), require('./menu-template').menuTemplate(account));
        $('.collapsible').collapsible();
    }
};