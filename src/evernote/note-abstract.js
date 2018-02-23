module.exports = {
    abstract: content => {
        var enml = content.substr(content.search('<en-note>') + '<en-note>'.length, 15);
        return enml.replace('\n', ' ') + '...';
    }
}