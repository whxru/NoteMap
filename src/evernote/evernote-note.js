const Evernote = require('evernote');
const devToken = require('../../config.json').developerToken;
const {EvernoteAccount} = require('./evernote-account.js');
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

function getInAppLink(noteId, uid, shardId){
    return `evernote:///view/${uid}/${shardId}/${noteId}/${noteId}/`;
}

function showGraph(graph) {
    var G = {};
    var client = new Evernote.Client({token:devToken});
    var uid,shardId;
    var account = new EvernoteAccount(client.getUserStore(),client.getNoteStore());
    var notebooks = {};
    var myNotes = {};
    client.getUserStore().getUser().then(function(user){
        uid = user.id;
        shardId = user.shardId;
        console.log(uid);
        console.log(shardId);
        client.getNoteStore().listNotebooks().then(function(nbs){
            for(nb of nbs){
                notebooks[nb.guid] = nb.name;
            }
            account.getAllNotes().then(notes => {
                for(noteId in notes){
                    myNotes[noteId] = {
                        'title': notes[noteId].title,
                        'content': notes[noteId].content,
                        'notebookId': notes[noteId].notebookGuid,
                        'link': getInAppLink(noteId, uid, shardId)
                    };
                    G[noteId] = [];
                    var reLink = /evernote:\/\/\/view\/[0-9][0-9]*\/[a-zA-Z0-9][a-zA-Z0-9]*\/[a-zA-Z0-9\-][a-zA-Z0-9\-]*\//g
                    let curLink;
                    while((curLink = reLink.exec(notes[noteId].content)) !== null){
                        G[noteId].push(curLink[0].split('\/')[6]);
                    }
                }
                drawGraph(graph, G, myNotes);
            });
        });
    });
}

function drawGraph(graph, G, myNotes){
    myConsole.log(G);
    myConsole.log(graph);
//    myConsole.log(myNotes);
    for(v in G){
        myConsole.log('\nv ==== ' + v);
   //     graph.addNode('sss').refresh();
        graph.addNode(myNotes[v].title).refresh();
    }
    for(u in G){
        for(v of G[u]){
            graph.addEdge(myNotes[u].title, myNotes[v].title).refresh();
        }
    }
   // graph.refresh();

}


module.exports = showGraph;

