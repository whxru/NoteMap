const { accessAccount } = require('./utils/access-account');
const { buildWindow } = require('./utils/build-window');
const { buildMenu } = require('./utils/build-menu');

buildWindow();
let account = accessAccount();
buildMenu(account);
/** 
 * // Example of using graph
 * const { Graph } = require('./graph/graph')
 * var graph = new Graph('#graph-container');
 * graph.addNode('node1').addNode('node2').addEdge('node1', 'node2').refresh();
 */
