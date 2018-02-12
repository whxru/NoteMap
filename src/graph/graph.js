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
                        title:'Image'
                    }
                },
                iconStyle: {
                    borderWidth: 2
                },
                bottom: 20,
                right: 20
            },
            series: [
                {
                    name: 'NoteMap',
                    type: 'graph',
                    layout: 'circular',
                    left: 'center',
                    top: 'middle',
                    roam: true,
                    // focusNodeAdjacency: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
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
     * @param {string} id - Identifier of the node
     * @param {string} name - Name of the node
     * @param {object} opts 
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
            this._graph.resize();
            this.refresh();
        });
    }

    _listenItemClick() {
        this._graph.on('click', args => {
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
        this._graph.showLoading();
    }

    _hideLoading() {
        this._graph.hideLoading();
    }
}

module.exports = {
    Graph: Graph
}