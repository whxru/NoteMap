const { accessAccount } = require('./utils/access-account');
const { buildWindow } = require('./utils/window-builder');

let account = accessAccount();
buildWindow();
var showGraph = require('./evernote/evernote-note.js');
const { Graph } = require('./graph/graph');
var graph = new Graph('graph-container');
//graph.addNode('1');
showGraph(graph)
/** 
 * // Example of using graph
 * const { Graph } = require('./graph/graph')
 * var graph = new Graph('graph-container');
 * graph.addNode('node1').addNode('node2').addEdge('node1', 'node2').refresh();
 */
