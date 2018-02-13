const { shell } = require('electron');
const { Graph } = require('../graph/graph');
const { notes2graph } = require('../utils/notes-to-graph');

module.exports = {
    buildGraph: account => {
        var graph = new Graph();
        notes2graph(account).then(({ G,notes }) => {
            console.log(notes);
            for (v in G) {
                graph.addNode(v, notes[v].title, {
                    category: notes[v].notebookGuid,
                    click: args => {
                        shell.openExternal(notes[v].link);
                    }
                });
            }
            for (u in G) {
                for (v of G[u]) {
                    graph.addEdge(u, v);
                }
            }
            graph.refresh();
        });

    }
}
