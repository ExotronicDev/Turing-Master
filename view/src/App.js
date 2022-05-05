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
import ProfessorMenu from "./components/ProfessorMenu";
import ProfessorCourse from "./components/ProfessorCourse";
import NewCourse from "./components/NewCourse";

import StudentRoutes from "./components/Routes/StudentRoutes";
import ProfessorRoutes from "./components/Routes/ProfessorRoutes";
import PublicRoutes from "./components/Routes/PublicRoutes";
import StudentCourse from "./components/StudentCourse";
import StudentExercise from "./components/StudentExercise";
import NewExercise from "./components/NewExercise";
import ProfessorExercise from "./components/ProfessorExercise";
import CourseStudents from "./components/CourseStudents";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Routes>
						{/* Public Routes */}
						<Route path="/login" element={<PublicRoutes />}>
							<Route exact path="/login" element={<Login />} />
						</Route>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/register" element={<Register />} />
						<Route exact path="/profile" element={<Profile />} />

						{/* Student Routes */}
						<Route path="/students/" element={<StudentRoutes />}>
							<Route
								exact
								path="/students/menu"
								element={<StudentMenu />}
							/>
							<Route
								exact
								path="/students/course/:code"
								element={<StudentCourse />}
							/>
							<Route
								exact
								path="/students/course/:code/exercise/:name"
								element={<StudentExercise />}
							/>
							<Route
								exact
								path="/students/simulator/:id"
								element={<Simulator />}
							/>
						</Route>

						{/* Professor Routes */}
						<Route
							path="/professors/"
							element={<ProfessorRoutes />}
						>
							<Route
								exact
								path="/professors/menu"
								element={<ProfessorMenu />}
							/>
							<Route
								exact
								path="/professors/course"
								element={<NewCourse />}
							/>
							<Route
								exact
								path="/professors/course/:code"
								element={<ProfessorCourse />}
							/>
							<Route
								exact
								path="/professors/course/:code/exercise"
								element={<NewExercise />}
							/>
							<Route
								exact
								path="/professors/course/:code/exercise/:name"
								element={<ProfessorExercise />}
							/>
							<Route
								exact
								path="/professors/course/:code/students"
								element={<CourseStudents />}
							/>
						</Route>
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
