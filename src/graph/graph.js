const { generateOption } = require('./graph-option');
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph');
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");

/**
 * Graph in the window.
 * @class Graph
 */
class Graph {
    /**
     * Creates an instance of Graph.
     * @memberof Graph
     */
    constructor(selector) {
        this._chart = echarts.init(document.querySelector("#graph-container"));
        this._nodes = [];
        this._edges = [];
        this._clickHandler = {};
        this._option = generateOption(this._nodes, this._edges);
        
        this._init();
    };
    
    /**
     * Shows or updates the graph.
     * @memberof Graph
     */
    refresh() {
        this._showLoading();
        this._chart.setOption(this._option);
        this._hideLoading();
    }
    
    /**
     * Adds a node to current graph.
     * @param {string} id - Identifier of the node
     * @param {string} name - Name of the node
     * @param {object} opts 
     * @param {string} opts.category - Category of this node
     * @param {function} opts.click - Handler of clicking the node
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addNode(id, name, opts) {
        var node = {
            id: id,
            name: name,
            symbolSize: 20,
        };
        
        if(opts) {
            if('click' in opts) { this._clickHandler[id] = opts.click; }
            if('category' in opts) { node.category = opts.category; }
        }
        
        this._nodes.push(node);
        
        return this;
    }
    
    /**
     * Adds an edge to current graph.
     * @param {string} sourceNode - ID of node which the edge starts from
     * @param {string} targetNode - ID of node which the edge ends with
     * @param {object} opts 
     * @param {function} opts.click - Handler of clicking the edge
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addEdge(sourceNode, targetNode, opts) {
        var edge = {
            source: sourceNode,
            target: targetNode,
        };
        
        if(opts) {
            if('click' in opts) { this._clickHandler[`${sourceNode} > ${targetNode}`] = opts.click; }
        }
        
        this._edges.push(edge);
        
        return this;
    }
    
    _init() {
        this._showLoading();
        this._autoResize();
        this._listenItemClick();
    }

    _autoResize() {
        require('electron').remote.getCurrentWindow().on('resize', () => {
            this._chart.resize();
            this.refresh();
        });
    }

    _listenItemClick() {
        this._chart.on('click', args => {
            var id = args.data.id;
            // Click node
            if(id && id in this._clickHandler) {
                this._clickHandler[id](args);
            }

            // Click edge
            var source = args.data.source;
            var target = args.data.target;
            if(source && args.name in this._clickHandler) {
                this._clickHandler[args.name](args);
            }
        });
        
    }

    _showLoading() {
        this._chart.showLoading();
    }

    _hideLoading() {
        this._chart.hideLoading();
    }
}

module.exports = Graph;
