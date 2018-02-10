const { accessAccount } = require('./utils/access-account');
const { buildWindow } = require('./utils/build-window');
const { buildMenu } = require('./utils/build-menu');
const { Graph } = require('./graph/graph');

buildWindow();
buildMenu(null);
var graph = new Graph('graph-container');
var showGraph = require('./evernote/evernote-note.js');
showGraph(graph);
