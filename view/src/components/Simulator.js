import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'react-flow-renderer';


const flowKey = 'example-flow';

const getNodeId = () => `${id++}`;
let id = 0;

const initialNodes = [
  { id: '1', data: { label: 'q0' }, position: { x: 100, y: 100 } },
];

const initialEdges = [];

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, label: "preuba", animated: true, style: { stroke: '#fff' } }, eds)), [setEdges]);
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
      data: { label: 'q'+id },
      position: {
        x: 0,
        y: 0,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const connectionLineStyle = { label: "asdad" }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      connectionLineStyle={connectionLineStyle}
    >
      <div className="save__controls">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
      </div>
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);
/*
change = (event) => {
  event.preventDefault();

  window.location = "/students/simulator/" + this.state.loggedId
}

/*------------------Simulator/SideBar-----------------------*/
/*
.dndflow {
	flex-direction: column;
	display: flex;
	flex-grow: 1;
	height: 100%;
}
  
.dndflow aside {
	border-right: 1px solid #eee;
	padding: 15px 10px;
	font-size: 12px;
	background: #000000;
	color: rgb(255, 255, 255);
}
  
.dndflow aside .description {
	margin-bottom: 10%;
}
  
.dndflow .dndnode {
	height: 20px;
	padding: 4px;
	border: 1px solid #1a192b;
	border-radius: 2px;
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: grab;
}
  
.dndflow .dndnode.input {
	border-color: #0041d0;
}
  
.dndflow .dndnode.output {
	border-color: #ff0072;
}

.dndflow .dndnode.save {
	margin-top: 13%;
	border-color: #b60404;
	cursor: pointer;
}
  
.dndflow .reactflow-wrapper {
	flex-grow: 1;
	width: 100%;
}
  
.dndflow .selectall {
	margin-top: 10px;
}
  
@media screen and (min-width: 768px) {
	.dndflow {
		flex-direction: row;
	}
	
	.dndflow aside {
		width: 20%;
		max-width: 250px;
	}
}

.save__controls {
	position: absolute;
	right: 10px;
	top: 10px;
	z-index: 4;
	font-size: 12px;
  }
  
  .save__controls button {
	margin-left: 5px;
  }

  */