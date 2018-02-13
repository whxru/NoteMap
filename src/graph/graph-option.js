module.exports = {
    generateOption: (nodes, edges) => {
        return {
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            tooltip: {
                show: true,
                triggerOn: 'mousemove|click',
                enterable: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true,
                        title: 'Image'
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
                    nodes: nodes,
                    edges: edges
                }
            ]
        };
    }
}