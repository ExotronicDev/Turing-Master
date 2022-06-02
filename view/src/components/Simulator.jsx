import React, { useState, useCallback } from "react";
import ReactFlow, {
	ReactFlowProvider,
	useNodesState,
	useEdgesState,
	addEdge,
	useReactFlow,
} from "react-flow-renderer";

import "../index.css";
import NavBar from "./NavBar/NavBar";

const flowKey = "example-flow";

const getNodeId = () => `${id++}`;
let id = 0;

const initialNodes = [
	{ id: "1", data: { label: "q0" }, position: { x: 100, y: 100 } },
];

const initialEdges = [];

const SaveRestore = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [rfInstance, setRfInstance] = useState(null);
	const { setViewport } = useReactFlow();

	const onConnect = useCallback(
		(params) =>
			setEdges((eds) =>
				addEdge(
					{
						...params,
						label: "prueba",
						animated: true,
						style: { stroke: "#fff" },
					},
					eds
				)
			),
		[setEdges]
	);
	const onSave = useCallback(() => {
		if (rfInstance) {
			const flow = rfInstance.toObject();
			localStorage.setItem(flowKey, JSON.stringify(flow));
		}
	}, [rfInstance]);

	const onRestore = useCallback(() => {
		const restoreFlow = async () => {
			const flow = JSON.parse(localStorage.getItem(flowKey));

			if (flow) {
				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				setNodes(flow.nodes || []);
				setEdges(flow.edges || []);
				setViewport({ x, y, zoom });
			}
		};

		restoreFlow();
	}, [setNodes, setViewport]);

	const onAdd = useCallback(() => {
		const newNode = {
			id: getNodeId(),
			data: { label: "q" + id },
			position: {
				x: 0,
				y: 0,
			},
		};
		setNodes((nds) => nds.concat(newNode));
	}, [setNodes]);

	const onDelete = useCallback(() => {
		setEdges([]);
		setNodes([]);
		id = 1;
	});

	const connectionLineStyle = { label: "asdad" };

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onInit={setRfInstance}
			connectionLineStyle={connectionLineStyle}
			style={{ height: 800 }}
		>
			<div className="save__controls">
				<button onClick={onSave}>save</button>
				<button onClick={onRestore}>restore</button>
				<button onClick={onAdd}>add node</button>
				<button onClick={onDelete}>delete</button>
			</div>
		</ReactFlow>
	);
};

export default () => (
	<>
		<NavBar /> {/* Added, needs style yet */}
		<ReactFlowProvider>
			<SaveRestore />
		</ReactFlowProvider>
	</>
);
