import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class ProfessorCourse extends Component {
	state = {
		code: "",
		name: "",
		students: [],
		exercises: [],
		loggedId: "",
	};

	componentDidMount = () => {
		this.setCourseCode();
		this.setLoggedId();
		this.getInfo();
	};

	setLoggedId() {
		this.state.loggedId = roleChecker.getLoggedId();
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

	setCourseCode() {
		let courseCode;
		const searchString = "/professors/course/";
		const currentUrl = window.location.href;

		var start = currentUrl.search(searchString);
		if (start === -1) {
			swal.fire({
				title: "Oops !",
				text: "Invalid URL.",
				icon: "error",
				background: "black",
				color: "white",
			}).then(() => {
				window.location = "/professors/menu";
			});
		}
		// length of "/students/course/", so searches next to it
		start += searchString.length;
		courseCode = currentUrl.substring(start);

		this.state.code = courseCode
	}

	getInfo = () => {
		// let apiUrl = "/api/courses/" + this.state.loggedId + "/courses";
		axios({
			url: "/api/courses/" + this.state.code,
			method: "GET",
		})
			.then((res) => {
				const isProfessor =
					res.data.role === "professors" ? true : false;
				this.setState({
					code: res.data.data.code,
					name: res.data.data.name,
					exercises: res.data.exercises,
					students: res.data.students
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Oops !",
					text: "Unexpected error, Try Again",
					icon: "error",
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
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a class="list-group-item list-group-item-action disabled">
					No Exercises registered
				</a>
			);
		}

		return exercises.map((exercise) => (
			<a
				/*href={"/students/courses/" + exercise.code}*/
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
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a class="list-group-item list-group-item-action disabled">
					No Students registered
				</a>
			);
		}

		return students.map((student) => (
			<a
				/*href={"/students/courses/" + exercise.code}*/
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{student.name} - {student.lastName}
			</a>
		));
	};

	addExercise = () => {
		swal.fire({
			title: "Fill the Exercise information",
			html:
				'<input id="swal-input1" class="swal2-input" placeholder="Name">' +
				'<input id="swal-input2" class="swal2-input" placeholder="Description">' +
				'<input id="swal-input3" class="swal2-input" placeholder="Input">' +
				'<input id="swal-input4" class="swal2-input" placeholder="Output">' +
				'<input id="swal-input5" class="swal2-input" placeholder="Example Input">' +
				'<input id="swal-input6" class="swal2-input" placeholder="Example Output">' ,
			background: "black",
			color: "white",
			confirmButtonText: 'Add',
			  customClass: {
				confirmButton: 'btn btn-success',
			},
		}).then((result) => {
			const exercise = {
				name: document.getElementById('swal-input1').value,
				description: document.getElementById('swal-input2').value,
				input: document.getElementById('swal-input3').value,
				output: document.getElementById('swal-input4').value,
				inputExample: document.getElementById('swal-input5').value,
				outputExample: document.getElementById('swal-input6').value,
			}

			console.log(exercise)

			/* Aqui funcion para insertar ejercicios*/	

			if (result.isConfirmed) {
			  swal.fire({
				title: 'Success!',
				text: 'Exercise Added !',
				icon:'success',
				background: "black",
				color: "white",
			  })
			}
		})
	}

	render() {
		return (
			<div class="ProfessorCourse">
				<NavBar />
				<div id="container">
					<p id="title"> Course {this.state.code} {this.state.name} information </p>
					<form onSubmit={this.submit}>
						<div class="form-group row align-items-end justify-content-end">
							<label for="name">Name</label>
							<div class="col-8">
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder="Name"
									name="name"
									//onChange={this.handleChange}
									//value={this.state.description}
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
												Exercises
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
													onClick={this.addExercise}
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
