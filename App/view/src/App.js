import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Views
import Home from "./Views/Home";
import Register from "./Views/Register";
import Login from "./Views/Login";
import MainView from "./Views/MainView";
import MachinesList from "./Views/MachinesList";
import EditProfile from "./Views/EditProfile";
import TuringIO from "./Views/TuringIO";
import TuringMachine from "./Views/TuringMachine";


class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Routes>
						<Route 
							exact 
							path="/" 
							element={<Home/>}></Route>
						<Route
							exact
							path="/TuringMachineSimulator/Register"
							element={<Register/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/Login/:user"
							element={<Login/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/MainView"
							element={<MainView/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/MachinesList"
							element={<MachinesList/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/EditProfile"
							element={<EditProfile/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/TuringIO"
							element={<TuringIO/>}
						></Route>
						<Route
							exact
							path="/TuringMachineSimulator/TuringMachine"
							element={<TuringMachine/>}
						></Route>
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
