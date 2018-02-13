const { accessAccount } = require('../utils/access-account');
const { buildWindow } = require('../builds/build-window');
const { buildMenu } = require('../builds/build-menu');
const { buildGraph } = require('../builds/build-graph');

buildWindow();
let account = accessAccount();
buildMenu('index', account);
buildGraph(account);
