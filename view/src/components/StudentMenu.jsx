/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import roleChecker from "./Routes/roleChecker";
import NavBar from "./NavBar/NavBar";

class StudentMenu extends Component {
	state = {
		courses: [],
		tMachines: [],
		loggedId: roleChecker.getLoggedId(),
	};

	componentDidMount = () => {
		this.getCourses();
		this.getTMachines();
	};

	getCourses = () => {
		let apiUrl = "/api/students/" + this.state.loggedId + "/courses";
		axios({
			url: apiUrl,
			method: "GET",
		})
			.then((res) => {
				const data = res.data.data;
				const courses = [];
				data.forEach((element) => {
					const course = {
						code: element.code,
						name: element.name,
					};
					courses.push(course);
				});
				this.setState({
					courses: courses,
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	getTMachines = () => {
		const apiUrl = "/api/students/" + this.state.loggedId + "/tmachines";
		axios({
			url: apiUrl,
			method: "GET",
		})
			.then((res) => {
				const data = res.data.data;
				const tMachines = [];
				data.forEach((element) => {
					const tMachine = {
						id: element.id,
						description: element.description,
					};
					tMachines.push(tMachine);
				});
				this.setState({
					tMachines: tMachines,
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
					window.location = "/";
				});
			});
	};

	displayTMachines = (tMachines) => {
		if (tMachines.length === 0) {
			return (
				<a className="list-group-item list-group-item-action disabled">
					No Turing Machines registered
				</a>
			);
		}

		return tMachines.map((tMachine) => (
			<a
				href={"/students/simulator/" + tMachine.id}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{tMachine.id} - {tMachine.description}
			</a>
		));
	};

	displayCourses = (courses) => {
		if (courses.length === 0) {
			return (
				<a className="list-group-item list-group-item-action disabled">
					No Courses enrolled
				</a>
			);
		}

		return courses.map((course) => (
			<a
				href={"/students/course/" + course.code}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{course.code} - {course.name}
			</a>
		));
	};

	change = (event) => {
		event.preventDefault();

		window.location = "/students/simulator/";
	};

	render() {
		return (
			<div className="StudentMenu">
				<NavBar />
				<div id="container">
					<h1 id="title">Student Menu</h1>
					<div className="row">
						<div className="col-6">
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
											Courses
										</button>
									</h2>
									<div
										id="courses-data"
										className="accordion-collapse collapse show"
										aria-labelledby="courses-heading"
										data-bs-parent="#courses-accordion"
									>
										<div className="list-group">
											{this.displayCourses(
												this.state.courses
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-6">
							<div className="accordion" id="tmachines-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="tmachines-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#tmachines-data"
										>
											Turing Machines
										</button>
									</h2>
									<div
										id="tmachines-data"
										className="accordion-collapse collapse show"
										aria-labelledby="tmachines-heading"
										data-bs-parent="#tmachines-accordion"
									>
										<div className="list-group">
											<a
												onClick={this.change}
												className="list-group-item list-group-item-action first-item"
												aria-current="true"
											>
												Create New Turing Machine
											</a>
											{this.displayTMachines(
												this.state.tMachines
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StudentMenu;
