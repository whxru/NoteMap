function getInAppLink(noteId, uid, shardId) {
    return `evernote:///view/${uid}/${shardId}/${noteId}/${noteId}/`;
}

function notes2graph(account) {
    var G = {};
    var account = account;
    var uid, shardId;
    var notebooks = {};
    return account.getUserStore().getUser().then(user => {
        uid = user.id;
        shardId = user.shardId;
        return account.getNoteStore().listNotebooks().then(nbs => {
            for(let nb of nbs) {
                notebooks[nb.guid] = nb.name;
            }
            return account.getAllNotes().then(notes => {
                for(let noteId in notes) {
                    notes[noteId]['link'] = getInAppLink(noteId, uid, shardId);
                    G[noteId] = [];
                    var reLink = /evernote:\/\/\/view\/[0-9][0-9]*\/[a-zA-Z0-9][a-zA-Z0-9]*\/[a-zA-Z0-9\-][a-zA-Z0-9\-]*\//g
                    let curLink;
                    while((curLink = reLink.exec(notes[noteId].content)) !== null) {
                        G[noteId].push(curLink[0].split('\/')[6]);
                    }
                }
                return {
                    G: G,
                    notes: notes
                }
            });
        });
    });
}

module.exports = {
    notes2graph: notes2graph
}

