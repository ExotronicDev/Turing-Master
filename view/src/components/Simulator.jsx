import React, { useState, useCallback, useEffect } from 'react';
import {useParams } from "react-router-dom";
import { axios, swal } from "../dependencies";
import ReactFlow, {
	ReactFlowProvider,
	useNodesState,
	useEdgesState,
	addEdge,
	useReactFlow,
} from "react-flow-renderer";

import "../index.css";
import NavBar from "./NavBar/NavBar";
import { clippingParents } from '@popperjs/core';



const flowKey = "example-flow";


const getNodeId = () => `${id++}`;
let id = 0;

const initialNodes = [];
const initialEdges = [];

const SaveRestore = (props) => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [rfInstance, setRfInstance] = useState(null);
	const { setViewport } = useReactFlow();
	const params = useParams();
	const [state, setState] = useState({tMachine: {}});

	useEffect(() => {
        axios({
			url: "/api/tmachines/" + params.id,
			method: "GET",
		})
		.then((res) => {
			setState({
				tMachine: res.data.data
			});
			
			const len = res.data.data.states.length;
			for (var i = 0; i < len; i++){
				if (res.data.data.states[i].initialState){
					const newNode = {
						id: res.data.data.states[i].name,
						data: { label: res.data.data.states[i].name },
						position: {
							x: 0,
							y: 0,
						},
						style: {background: "#08ADA2"}
					};
					setNodes((nds) => nds.concat(newNode))
				} else {
					const newNode = {
						id: res.data.data.states[i].name,
						data: { label: res.data.data.states[i].name },
						position: {
							x: 0,
							y: 0,
						},
					};
					setNodes((nds) => nds.concat(newNode))
				}
			}

			for (var i = 0; i < len; i++){
				const transLen = res.data.data.states[i].exitTransitions.length;
				for (var j = 0; j < transLen; j++ ){
					const newEdge = {
						id: j,
						source: res.data.data.states[i].name,
						target: res.data.data.states[i].exitTransitions[j].targetState.name,
						label: res.data.data.states[i].exitTransitions[j].readValue,
						animated: true,
						style: { stroke: "#fff" },
					}
					setEdges((nds) => nds.concat(newEdge))
				}
			}
		})

		.catch((err) => {
			});
    }, []);

	const onConnect = 
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

	const simulate = useCallback(() => {
		swal.fire({
			title: "Please insert a tape to simulate",
			input: "text",
			background: "black",
			color: "white",
		}).then((result) => {
			console.log(result);
			axios({
				url: "/api/tmachines/simulate",
				method: "POST",
				data: {
					tMachine: state.tMachine,
					input: result.value
				}
			})
			.then((res) => {
				swal.fire({
					title: "The result is: " + res.data.data.output,
					background: "black",
					color: "white",
				})
			})
		})
	})

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
			style={{ height: 3000 }}
		>
			<div className="save__controls">
				<button onClick={simulate}>Simulate</button>
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