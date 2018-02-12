function notes2graph(account, graph) {
    var G = {};
    var account = account;
    var uid, shardId;
    var notebooks = {};
    account.getUserStore().getUser().then(user => {
        uid = user.id;
        shardId = user.shardId;
        account.getNoteStore().listNotebooks().then(nbs => {
            for(let nb of nbs) {
                notebooks[nb.guid] = nb.name;
            }
            account.getAllNotes().then(notes => {
                for(let noteId in notes) {
                    notes[noteId]['link'] = getInAppLink(noteId, uid, shardId);
                    G[noteId] = [];
                    var reLink = /evernote:\/\/\/view\/[0-9][0-9]*\/[a-zA-Z0-9][a-zA-Z0-9]*\/[a-zA-Z0-9\-][a-zA-Z0-9\-]*\//g
                    let curLink;
                    while((curLink = reLink.exec(notes[noteId].content)) !== null) {
                        G[noteId].push(curLink[0].split('\/')[6]);
                    }
                }
                drawGraph(graph, G, notes);
            });
        });
    });
}

function getInAppLink(noteId, uid, shardId) {
    return `evernote:///view/${uid}/${shardId}/${noteId}/${noteId}/`;
}

function drawGraph(graph, G, myNotes) {
    for(v in G){
        graph.addNode(v, myNotes[v].title);
    }
    for(u in G){
        for(v of G[u]){
            graph.addEdge(u, v);
        }
    }
   graph.refresh();
}


module.exports = {
    notes2graph: notes2graph
};

