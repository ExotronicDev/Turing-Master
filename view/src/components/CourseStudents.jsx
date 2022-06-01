/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class CourseStudents extends Component {
	state = {
		students: [],
		courseStudents: [],
	};

	componentDidMount = () => {
		this.getStudents();
		this.getCourseStudents();
	};

	getStudents = () => {
		axios({
			url: "/api/students",
			method: "GET",
		}).then((res) => {
			this.setState({
				students: res.data.data,
			});
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
		});
	};

	change = (student) => {
		if (document.getElementById("student-box-" + student.id).checked) {
			this.state.courseStudents.push(student);
		} else if (
			!document.getElementById("student-box-" + student.id).checked
		) {
			this.deleteStudent(student);
		}
		this.forceUpdate();
	};

	isInCourse = (student, courseStudents) => {
		for (const stud of courseStudents) {
			if (stud.id === student.id) return true;
		}
		return false;
	};

	deleteStudent = (student) => {
		this.state.courseStudents = this.state.courseStudents.filter(
			(element) => student.id !== element.id
		);
	};

	displayStudents = (students, courseStudents) => {
		if (students.length === 0) {
			return (
				<th id="noStudents" scope="row" colSpan="3">
					No students registered
				</th>
			);
		}

		return students.map((student) => (
			<tr>
				<td>{student.id}</td>
				<td>
					{student.firstName} {student.lastName}
				</td>
				<td>
					<input
						id={"student-box-" + student.id}
						type="checkbox"
						onChange={() => {
							this.change(student);
						}}
						checked={this.isInCourse(student, courseStudents)}
					></input>
				</td>
			</tr>
		));
	};

	submit = (event) => {
		event.preventDefault();

		const studentIdArray = [];
		this.state.courseStudents.forEach((student) =>
			studentIdArray.push(student.id)
		);

		axios({
			url: "/api/courses/" + this.props.match.params.code + "/students",
			method: "POST",
			data: { studentIdArray },
		})
			.then(() => {
				swal.fire({
					title: "Success!",
					text: "Students have been modified successfully!",
					icon: "success",
					background: "black",
					color: "white",
				}).then(() => {
					window.location =
						"/professors/course/" + this.props.match.params.code;
				});
			})
			.catch((err) => {
				if (err.response.status === 500)
					err.response.data.error = err.response.statusText;
				swal.fire({
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	render() {
		return (
			<div className="CourseStudents">
				<NavBar />
				<div id="container">
					<h1 id="title"> Students </h1>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<table
								id="studentTable"
								className="table table-secondary"
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
								className="btn btn-primary"
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
