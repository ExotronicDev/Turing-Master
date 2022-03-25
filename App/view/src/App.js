import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Views
import Home from "./Views/Home";
import Register from "./Views/Register";
import Login from "./Views/Login";
import MainView from "./Views/MainView";

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
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
