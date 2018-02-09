const { accessAccount } = require('./utils/access-account');

let account = accessAccount();

/** 
 * Example of using graph
 * const { Graph } = require('./graph/graph')
 * var graph = new Graph('graph-container');
 * graph.addNode('node1').addNode('node2').addEdge('node1', 'node2').refresh();
 */
