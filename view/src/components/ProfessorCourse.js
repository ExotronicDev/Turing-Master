/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class ProfessorCourse extends Component {
	state = {
		code: "",
		name: "",
		students: [],
		exercises: [],
	};

	componentDidMount = () => {
		this.getInfo();
	};

	getInfo = () => {
		axios({
			url: "/api/courses/" + this.props.match.params.code,
			method: "GET",
		})
			.then((res) => {
				this.setState({
					code: res.data.data.code,
					name: res.data.data.name,
					exercises: res.data.data.exercises,
					students: res.data.data.students,
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	//Función que actualiza los states
	handleChange = (event) => {
		const target = event.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value,
		});
	};

	displayExercises = (exercises) => {
		if (exercises.length === 0) {
			return (
				<a class="list-group-item list-group-item-action disabled">
					No Exercises registered
				</a>
			);
		}

		return exercises.map((exercise) => (
			<a
				href={
					"/professors/course/" +
					this.state.code +
					"/exercise/" +
					exercise.slugName
				}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{exercise.name}
			</a>
		));
	};

	displayStudents = (students) => {
		if (students.length === 0) {
			return (
				<a class="list-group-item list-group-item-action disabled">
					No Students registered
				</a>
			);
		}

		return students.map((student) => (
			<a
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{student.firstName} {student.lastName} - {student.id}
			</a>
		));
	};

	change = () => {
		if (document.getElementById("check2").checked) {
			document.getElementById("save").disabled = "";
		}

		if (!document.getElementById("check2").checked) {
			document.getElementById("save").disabled = "disabled";
		}

		if (document.getElementById("check2").checked) {
			document.getElementById("name").disabled = "";
		}

		if (!document.getElementById("check2").checked) {
			document.getElementById("name").disabled = "disabled";
		}
	};

	save = () => {};

	render() {
		return (
			<div class="ProfessorCourse">
				<NavBar />
				<div id="container">
					<p id="title">
						{" "}
						{this.state.code} - {this.state.name}
					</p>
					<form onSubmit={this.save}>
						<div class="form-group row align-items-end justify-content-end">
							<label for="name">Course name</label>
							<div class="col-8">
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder="Name"
									name="name"
									onChange={this.handleChange}
									value={this.state.name}
									disabled="disabled"
								/>
							</div>
							<div class="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div class="col-1" id="check">
								<input
									id="check2"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div class="form-group row align-items-end justify-content-end">
							<label for="email">Exercises</label>
							<div class="accordion" id="exercises-accordion">
								<div class="accordion-item">
									<h2
										class="accordion-header"
										id="exercises-heading"
									>
										<button
											type="button"
											class="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#exercises-data"
										>
											Exercises
										</button>
									</h2>
									<div
										id="exercises-data"
										class="accordion-collapse collapse show"
										aria-labelledby="exercises-heading"
										data-bs-parent="#exercises-accordion"
									>
										<div class="list-group">
											<a
												href={
													this.state.code +
													"/exercise"
												}
												class="list-group-item list-group-item-action"
												aria-current="true"
											>
												Create New Exercise
											</a>
											{this.displayExercises(
												this.state.exercises
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="form-group row align-items-end justify-content-end">
							<label for="email">Students</label>
							<div class="accordion" id="courses-accordion">
								<div class="accordion-item">
									<h2
										class="accordion-header"
										id="courses-heading"
									>
										<button
											type="button"
											class="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#courses-data"
										>
											Students
										</button>
									</h2>
									<div
										id="courses-data"
										class="accordion-collapse collapse show"
										aria-labelledby="courses-heading"
										data-bs-parent="#courses-accordion"
									>
										<div class="list-group">
											<a
												href={
													this.state.code +
													"/students"
												}
												class="list-group-item list-group-item-action"
												aria-current="true"
											>
												Manage Students
											</a>
											{this.displayStudents(
												this.state.students
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<button
							id="save"
							type="submit"
							class="btn btn-primary"
							disabled="disabled"
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default ProfessorCourse;
