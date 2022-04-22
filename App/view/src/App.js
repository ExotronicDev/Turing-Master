import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

//Views
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import StudentMenu from "./components/StudentMenu";
import Profile from "./components/Profile";
import Simulator from "./components/Simulator";
import TeacherMenu from "./components/TeacherMenu";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Routes>
						<Route exact path="/" element={<Home />}></Route>
						<Route
							exact
							path="/register"
							element={<Register />}
						></Route>
						<Route exact path="/login" element={<Login />}></Route>
						<Route
							exact
							path="/profile"
							element={<Profile />}
						></Route>
						<Route
							exact
							path="/students/menu"
							element={<StudentMenu />}
						></Route>
						<Route
							exact
							path="/students/simulator/:id"
							element={<Simulator />}
						></Route>
						<Route
							exact
							path="/teachers/menu"
							element={<TeacherMenu />}
						></Route>
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
