import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

const Checkbox = ({ isChecked, student, index }) => {
	if (isChecked) {
		return (
			<input
				type="checkbox"
				id="checkbox"
				checked
				onChange={() => {
					this.change(student, index);
				}}
			/>
		);
	} else {
		return (
			<input
				type="checkbox"
				id="checkbox"
				onChange={() => {
					this.change(student, index);
				}}
			/>
		);
	}
};

class CourseStudents extends Component {
	state = {
		students: [],
		courseStudents: [],
		loggedId: "",
	};

	componentDidMount = () => {
		this.setLoggedId();
		const students = this.getStudents();
		const courseStudents = this.getCourseStudents();
		this.setCourseStudents(students, courseStudents);
	};

	setLoggedId() {
		const id = roleChecker.getLoggedId();
		this.setState({
			loggedId: id,
		});
		if (this.state.loggedId === undefined) {
			swal.fire({
				title: "Oops !",
				text: "User does not have access to this page. Please login to access.",
				icon: "error",
				background: "black",
				color: "white",
			}).then(() => {
				window.location = "/login";
			});
		}
	}

	getStudents = () => {
		axios({
			url: "/api/students",
			method: "GET",
		}).then((res) => {
			this.setState({
				students: res.data.data,
			});
			return res.data.data;
		});
	};

	getCourseStudents = () => {
		axios({
			url: "/api/courses/" + this.props.match.params.code + "/students",
			method: "GET",
		}).then((res) => {
			this.setState({
				courseStudents: res.data.data,
			});
			return res.data.data;
		});
	};

	containsId(id, students) {
		for (let i = 0; i < students.length; i++) {
			let student = students[i];
			console.log(id, student.id, student.id === id);
			if (student.id === id) {
				return true;
			}
		}
		return false;
	}

	inCourse(student, courseStudents) {
		console.log("Entra");
		if (this.containsId(student.id, courseStudents)) {
			console.log("Sale true");
			return true;
		}
		console.log("Sale false");
		return false;
	}

	setCourseStudents = (students, courseStudents) => {
		students.forEach((student) => {
			// console.log(student);
			if (this.inCourse(student, courseStudents)) {
				student.inCourse = true;
			} else {
				student.inCourse = false;
			}
		});
		this.state.students = students;
		return students;
	};

	change = (student, index) => {
		if (document.getElementById(index).checked) {
			this.state.courseStudents.push(student);
		}

		if (!document.getElementById(index).checked) {
			this.state.courseStudents.filter((thisStudent, index, object) => {
				if (thisStudent.id === student.id) {
					object.splice(index, 1);
				}
			});
		}
	};

	displayStudents = (students, courseStudents) => {
		// students = this.setCourseStudents(students, this.state.courseStudents);
		// console.log(students);
		if (students.length === 0) {
			return (
				<th id="noStudents" scope="row" colspan="3">
					No students registered
				</th>
			);
		}

		return students.map((student, index) => (
			<tr>
				<td>{student.id}</td>
				<td>
					{student.firstName} {student.lastName}
				</td>
				<td>
					<Checkbox
						isChecked={student.inCourse}
						student={student}
						index={index}
					/>
				</td>
			</tr>
		));
	};

	render() {
		console.log(this.state);
		return (
			<div className="CourseStudents">
				<NavBar />
				<div id="container">
					<h1 id="title"> Students </h1>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<table
								id="studentTable"
								class="table table-secondary"
							>
								<thead>
									<tr>
										<th scope="col">ID</th>
										<th scope="col">Name</th>
										<th scope="col">Enrolled</th>
									</tr>
								</thead>
								<tbody>
									{this.displayStudents(
										this.state.students,
										this.state.courseStudents
									)}
								</tbody>
							</table>

							<button
								id="save"
								type="submit"
								class="btn btn-primary"
							>
								Save Changes
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default CourseStudents;
