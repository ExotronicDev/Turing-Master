/*import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem,
} from "../../dependencies";

class Sidebar extends Component {
	render() {
		return (
			<div
				style={{
					display: "flex",
					height: "100vh",
					overflow: "scroll initial",
				}}
			>
				<CDBSidebar textColor="#fff" backgroundColor="#333">
					<CDBSidebarHeader
						prefix={<i className="fa fa-bars fa-large"></i>}
					>
						<a
							className="text-decoration-none"
							style={{ color: "inherit" }}
						>
							Jesús
						</a>
					</CDBSidebarHeader>

					<CDBSidebarContent className="sidebar-content">
						<CDBSidebarMenu>
							<NavLink
								exact
								to="/"
								activeClassName="activeClicked"
							>
								<CDBSidebarMenuItem icon="columns">
									Save Machine
								</CDBSidebarMenuItem>
							</NavLink>
							<NavLink
								exact
								to="/tables"
								activeClassName="activeClicked"
							>
								<CDBSidebarMenuItem icon="table">
									Load Machine
								</CDBSidebarMenuItem>
							</NavLink>
							<NavLink
								exact
								to="/profile"
								activeClassName="activeClicked"
							>
								<CDBSidebarMenuItem icon="user">
									Edit Machine
								</CDBSidebarMenuItem>
							</NavLink>
						</CDBSidebarMenu>
					</CDBSidebarContent>

					<CDBSidebarFooter style={{ textAlign: "center" }}>
						<div
							style={{
								padding: "20px 5px",
							}}
						>
							Sidebar Footer
						</div>
					</CDBSidebarFooter>
				</CDBSidebar>
			</div>
		);
	}
}

export default Sidebar; */
 
import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        State
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Final State
      </div>

	  <button className="dndnode save" onClick={console.log("asdasdasasadada")}>
        Save Machine
      </button>
    </aside>
  );
};