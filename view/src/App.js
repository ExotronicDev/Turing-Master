import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { withParams } from "./components/Routes/withParams";
import "./App.css";

//---------------Shared Views---------------//
import PublicRoutes from "./components/Routes/PublicRoutes";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

//---------------Student Views---------------//
import StudentRoutes from "./components/Routes/StudentRoutes";
import StudentMenu from "./components/StudentMenu";
import StudentCourse from "./components/StudentCourse";
import StudentExercise from "./components/StudentExercise";
import Simulator from "./components/Simulator";

//---------------Professor Views---------------//
import ProfessorRoutes from "./components/Routes/ProfessorRoutes";
import ProfessorMenu from "./components/ProfessorMenu";
import NewCourse from "./components/NewCourse";
import ProfessorCourse from "./components/ProfessorCourse";
import CourseStudents from "./components/CourseStudents";
import NewExercise from "./components/NewExercise";
import ProfessorExercise from "./components/ProfessorExercise";
import ExerciseSolutions from "./components/ExerciseSolutions";

//---------------Params Student Routes---------------//
const StudentCourseRoute = withParams(StudentCourse);
const StudentExerciseRoute = withParams(StudentExercise);
const SimulatorRoute = withParams(Simulator);

//---------------Params Professor Routes---------------//
const ProfessorCourseRoute = withParams(ProfessorCourse);
const CourseStudentsRoute = withParams(CourseStudents);
const NewExerciseRoute = withParams(NewExercise);
const ProfessorExerciseRoute = withParams(ProfessorExercise);
const ExerciseSolutionsRoute = withParams(ExerciseSolutions);

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
								element={<StudentCourseRoute />}
							/>
							<Route
								exact
								path="/students/course/:code/exercise/:name"
								element={<StudentExerciseRoute />}
							/>
							<Route
								exact
								path="/students/simulator/"
								element={<Simulator />}
							/>
							<Route
								exact
								path="/students/simulator/:id"
								element={<SimulatorRoute />}
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
								element={<ProfessorCourseRoute />}
							/>
							<Route
								exact
								path="/professors/course/:code/students"
								element={<CourseStudentsRoute />}
							/>
							<Route
								exact
								path="/professors/course/:code/exercise"
								element={<NewExerciseRoute />}
							/>
							<Route
								exact
								path="/professors/course/:code/exercise/:name"
								element={<ProfessorExerciseRoute />}
							/>
							<Route
								exact
								path="/professors/course/:code/exercise/:name/solutions"
								element={<ExerciseSolutionsRoute />}
							/>
						</Route>
					</Routes>
				</Router>
			</div>
		);
	}
}

export default App;
