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
		cloning: false,
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
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				}).then(() => {
					window.location = "/professors/menu";
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
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className="list-group-item list-group-item-action disabled">
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
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{exercise.name}
			</a>
		));
	};

	displayStudents = (students) => {
		if (students.length === 0) {
			return (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className="list-group-item list-group-item-action disabled">
					No Students registered
				</a>
			);
		}

		return students.map((student) => (
			<a
				/*href={"/students/courses/" + exercise.code}*/
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{student.id} - {student.firstName} {student.lastName}
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

	cloneCourse = (event) => {
		event.preventDefault();
		swal.fire({
			title: "Are you sure you want to clone the current Course?",
			input: "text",
			inputLabel:
				"The Course name, professor and exercises will be copied. You will new a new Course code for the cloned Course.",
			inputPlaceholder: "Enter the new Course code",
			showCancelButton: true,
			confirmButtonText: "Clone",
			customClass: {
				confirmButton: "btn btn-success",
				cancelButton: "btn btn-danger",
			},
			inputValidator: (value) => {
				if (!value) {
					return "You need to enter a new Course code!";
				}
			},
			background: "black",
			color: "white",
		})
			.then((result) => {
				if (result.isConfirmed) {
					axios({
						url: "/api/courses/" + this.props.match.params.code,
						method: "POST",
						data: { newCourseCode: result.value },
					})
						.then(() =>
							swal.fire({
								title: "Success!",
								text: "Course has been cloned successfully!",
								icon: "success",
								background: "black",
								color: "white",
							})
						)
						.then(() => (window.location = "/professors/menu"));
				}
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
			<div className="ProfessorCourse">
				<NavBar />
				<div id="container">
					<p id="title">
						{" "}
						{this.state.code} - {this.state.name}{" "}
					</p>
					<form onSubmit={this.save}>
						<div className="form-group row align-items-end justify-content-end">
							<label for="name">Course name</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Name"
									name="name"
									onChange={this.handleChange}
									value={this.state.name}
									disabled="disabled"
								/>
							</div>
							<div className="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check2"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row align-items-end justify-content-end">
							<label for="email">Exercises</label>
							<div className="accordion" id="exercises-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="exercises-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#exercises-data"
										>
											Exercises
										</button>
									</h2>
									<div
										id="exercises-data"
										className="accordion-collapse collapse show"
										aria-labelledby="exercises-heading"
										data-bs-parent="#exercises-accordion"
									>
										<div className="list-group">
											<a
												href={
													this.state.code +
													"/exercise"
												}
												className="list-group-item list-group-item-action"
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

						<div className="form-group row align-items-end justify-content-end">
							<label for="email">Students</label>
							<div className="accordion" id="courses-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="courses-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#courses-data"
										>
											Students
										</button>
									</h2>
									<div
										id="courses-data"
										className="accordion-collapse collapse show"
										aria-labelledby="courses-heading"
										data-bs-parent="#courses-accordion"
									>
										<div className="list-group">
											<a
												href={
													this.state.code +
													"/students"
												}
												className="list-group-item list-group-item-action"
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

						<div className="course-options">
							<button
								id="clone"
								className="btn btn-primary"
								onClick={this.cloneCourse}
							>
								Clone Course
							</button>

							<button
								id="save"
								type="submit"
								className="btn btn-primary"
								disabled="disabled"
							>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default ProfessorCourse;
