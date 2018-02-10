var nodeConsole = require('console');

var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

function notes2graph(graph, account) {
    var G = {};
    var account = account;
    var uid, shardId;
    var notebooks = {};
    var myNotes = {};
    account.getUserStore().getUser().then(user => {
        uid = user.id;
        shardId = user.shardId;
        console.log(uid);
        console.log(shardId);
        account.getNoteStore().listNotebooks().then(nbs => {
            for(nb of nbs) {
                notebooks[nb.guid] = nb.name;
            }
            account.getAllNotes().then(notes => {
                for(noteId in notes) {
                    myNotes[noteId] = {
                        'title': notes[noteId].title,
                        'content': notes[noteId].content,
                        'notebookId': notes[noteId].notebookGuid,
                        'link': getInAppLink(noteId, uid, shardId)
                    };
                    G[noteId] = [];
                    var reLink = /evernote:\/\/\/view\/[0-9][0-9]*\/[a-zA-Z0-9][a-zA-Z0-9]*\/[a-zA-Z0-9\-][a-zA-Z0-9\-]*\//g
                    let curLink;
                    while((curLink = reLink.exec(notes[noteId].content)) !== null) {
                        G[noteId].push(curLink[0].split('\/')[6]);
                    }
                }
                drawGraph(graph, G, myNotes);
            });
        });
    });
}

function getInAppLink(noteId, uid, shardId) {
    return `evernote:///view/${uid}/${shardId}/${noteId}/${noteId}/`;
}

function drawGraph(graph, G, myNotes) {
    myConsole.log(G);
    myConsole.log(graph);
    // myConsole.log(myNotes);
    for(v in G){
        myConsole.log('\nv ==== ' + v);
        // graph.addNode('sss').refresh();
        graph.addNode(myNotes[v].title).refresh();
    }
    for(u in G){
        for(v of G[u]){
            graph.addEdge(myNotes[u].title, myNotes[v].title).refresh();
        }
    }
   // graph.refresh();

}


module.exports = {
    notes2graph: notes2graph
};

