import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import api from '../services/api';
import Layout from '../components/Layout';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = direction === 'LR' ? 'left' : 'top';
        node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const SkillsGraph = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const { data } = await api.get('/graph/skills');

                // Color nodes based on status
                const coloredNodes = data.nodes.map(node => {
                    let style = { background: '#fff', border: '1px solid #777', width: 170 };

                    if (data.mastered.includes(node.id)) {
                        style = { ...style, background: '#dcfce7', borderColor: '#22c55e' }; // Green
                    } else if (data.recommendedNext.includes(node.id)) {
                        style = { ...style, background: '#fef9c3', borderColor: '#eab308' }; // Yellow
                    }

                    return {
                        ...node,
                        style
                    };
                });

                const layouted = getLayoutedElements(
                    coloredNodes,
                    data.edges.map(e => ({ ...e, markerEnd: { type: MarkerType.ArrowClosed } }))
                );

                setNodes(layouted.nodes);
                setEdges(layouted.edges);
            } catch (error) {
                console.error("Error loading graph", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGraph();
    }, [setNodes, setEdges]);

    return (
        <Layout>
            <div className="h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-800">Skills Dependency Graph</h1>
                    <div className="flex gap-4 text-sm">
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-200 border border-green-500 mr-1"></span> Mastered</span>
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500 mr-1"></span> Recommended</span>
                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-white border border-gray-400 mr-1"></span> Not Started</span>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                    >
                        <Background color="#aaa" gap={16} />
                        <Controls />
                    </ReactFlow>
                )}
            </div>
        </Layout>
    );
};

export default SkillsGraph;
