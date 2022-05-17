import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

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

	displayStudents = (students) => {
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
					<input
						id={index}
						type="checkbox"
						onChange={() => {
							this.change(student, index);
						}}
					></input>
				</td>
			</tr>
		));
	};

	save = () => {};

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
									{this.displayStudents(this.state.students)}
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
