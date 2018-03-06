module.exports = (notes) => {
    var G = {};
    for(let noteId in notes) {
        G[noteId] = [];
        var reLink = /evernote:\/\/\/view\/[0-9][0-9]*\/[a-zA-Z0-9][a-zA-Z0-9]*\/[a-zA-Z0-9\-][a-zA-Z0-9\-]*\//g
        let curLink;
        while((curLink = reLink.exec(notes[noteId].content)) !== null) {
            G[noteId].push(curLink[0].split('\/')[6]);
        }
    }
    return G;
}
