function addContent(cm, value) {
    cm.setSelection(cm.getCursor(), cm.getCursor());
    cm.replaceSelection(value);
}

module.exports = addContent;