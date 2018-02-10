const { Graph } = require('../graph/graph')
const { notes2graph } = require('../utils/notes-to-graph');

module.exports = {
    buildGraph: account => {
        var graph = new Graph();
        notes2graph(graph, account);
    }
}
