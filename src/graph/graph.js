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
        this._graph = echarts.init(document.querySelector("#graph-container"));
        this._nodes = [];
        this._edges = [];
        this._clickHandler = {};
        this._option = {
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            tooltip: {
                show: true,
                triggerOn: 'mousemove|click',
                enterable: true
            },
            toolbox:{
                feature:{
                    saveAsImage: {
                        show: true,
                        title:'Save as image'
                    }
                }
            },
            series: [
                {
                    name: 'NoteMap',
                    type: 'graph',
                    layout: 'circular',
                    roam: false,
                    focusNodeAdjacency: true,
                    label: {
                        show: true
                    },
                    nodes: this._nodes,
                    edges: this._edges
                }
            ]
        };
        
        this._init();
        
    };
    
    /**
     * Shows or updates the graph.
     * @memberof Graph
     */
    refresh() {
        this._showLoading();
        this._graph.setOption(this._option);
        this._hideLoading();
    }
    
    /**
     * Adds a node to current graph.
     * @param {string} name - Identifier of the node
     * @param {object} opts 
     * @param {function} opts.click - Handler of clicking the node
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addNode(name, opts) {
        var node = {
            name: name,
            symbolSize: 60
        };
        
        if(opts) {
            if('click' in opts) { this._clickHandler[name] = opts.click; }
        }
        
        this._nodes.push(node);
        
        return this;
    }
    
    /**
     * Adds an edge to current graph.
     * @param {string} sourceNode - Name of node which the edge starts from
     * @param {string} targetNode - Name of node which the edge ends with
     * @param {object} opts 
     * @param {function} opts.click - Handler of clicking the edge
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addEdge(sourceNode, targetNode, opts) {
        var edge = {
            source: sourceNode,
            target: targetNode
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
            this._graph.resize();
        });
    }

    _listenItemClick() {
        this._graph.on('click', args => {
            if(args.name in this._clickHandler) {
                this._clickHandler[args.name](args);
            }
        });
        
    }

    _showLoading() {
        this._graph.showLoading();
    }

    _hideLoading() {
        this._graph.hideLoading();
    }
}

module.exports = {
    Graph: Graph
}