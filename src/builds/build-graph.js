const { shell, ipcRenderer } = require('electron');
const Graph = require('../graph/graph');
const notes2graph = require('../graph/notes-to-graph');

module.exports = () => {
    var graph = new Graph();
    ipcRenderer.send('get-all-notes');
    ipcRenderer.on('all-notes', (evt, notes) => {
        var G = notes2graph(notes);
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

