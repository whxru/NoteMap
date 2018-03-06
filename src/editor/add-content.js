function addContent(cm, value) {
    console.log(value);
    cm.setSelection(cm.getCursor(), cm.getCursor());
    cm.replaceSelection(value);
}

module.exports = addContent;