import { React, Component, Router, Routes, Route } from "./dependencies";
import "./App.css";

//Views
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import StudentMenu from "./components/StudentMenu";
import MachinesList from "./components/MachinesList";
import EditProfile from "./components/EditProfile";
import TuringIO from "./components/TuringIO";
import TuringMachine from "./components/TuringMachine";

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
						<Route exact path="/login/" element={<Login />}></Route>
						<Route
							exact
							path="/students/menu"
							element={<StudentMenu />}
						></Route>
						<Route
							exact
							path="/MachinesList"
							element={<MachinesList />}
						></Route>
						<Route
							exact
							path="/EditProfile"
							element={<EditProfile />}
						></Route>
						<Route
							exact
							path="/TuringIO"
							element={<TuringIO />}
						></Route>
						<Route
							exact
							path="/TuringMachine"
							element={<TuringMachine />}
						></Route>
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
