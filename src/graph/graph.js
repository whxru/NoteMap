const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph')

/**
 * Graph in the window.
 * @class Graph
 */
class Graph {
    /**
     * Creates an instance of Graph.
     * @param {string} containerId - Element ID of the container 
     * @memberof Graph
     */
    constructor(containerId) {
        this._graph = echarts.init(document.getElementById(containerId));
        this._nodes = [];
        this._edges = [];
        this._option = {
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    name: 'NoteMap',
                    type: 'graph',
                    layout: 'circular',
                    focusNodeAdjacency: true,
                    label: {
                        show: true
                    },
                    nodes: this._nodes,
                    edges: this._edges
                }
            ]
        };
    };

    /**
     * Shows or updates the graph.
     * @memberof Graph
     */
    refresh() {
        this._graph.setOption(this._option);
    }
    
    /**
     * Adds a node to current graph.
     * @param {string} name - Identifier of the node
     * @param {object} opts 
     * @param {string} opts.link - Address where the node links to  
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addNode(name, opts) {
        var node = {
            name: name,
            symbolSize: 60
        };
        
        if(opts) {
            //to-do: handle option settings
        }
        
        this._nodes.push(node);

        return this;
    }

    /**
     * Adds an edge to current graph.
     * @param {string} sourceNode - Name of node which the edge starts from
     * @param {string} targetNode - Name of node which the edge ends with
     * @param {object} opts 
     * @returns {Graph} For cascading call of methods
     * @memberof Graph
     */
    addEdge(sourceNode, targetNode, opts) {
        var edge = {
            source: sourceNode,
            target: targetNode
        };

        if(opts) {
            //to-do: handle option settings
        }
        
        this._edges.push(edge);

        return this;
    }

}

module.exports = {
    Graph: Graph
}