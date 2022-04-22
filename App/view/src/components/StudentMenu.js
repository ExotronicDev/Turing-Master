import React, { Component } from "react";
import { Cookies, axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class StudentMenu extends Component {
	state = {
		courses: [],
		tMachines: [],
	};

	componentDidMount = () => {
		const token = Cookies.get("token");
		if (token === undefined) {
			window.location = "/login";
		}

		this.getTMachines();
	};

	getCourses = () => {
		console.log(this.state.tMachines);
	};

	getTMachines = () => {
		axios({
			url: "/api/students/" + localStorage.getItem("id") + "/tmachines",
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
				console.log(this.state.tMachines);
				console.log("Data lista");
			})
			.catch((err) => {
				console.log(err);
				swal.fire({
					title: "Error!",
					text: err,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	displayTMachines = (tMachines) => {
		if (tMachines.length === 0) {
			return (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a class="list-group-item list-group-item-action disabled">
					No Turing Machines registered
				</a>
			);
		}

		return tMachines.map((tMachine) => (
			<a
				href={"/students/simulator/" + tMachine.id}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{tMachine.id} - {tMachine.description}
			</a>
		));
	};

	displayCourses = (courses) => {
		if (courses.length === 0) {
			return (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a class="list-group-item list-group-item-action disabled">
					No Courses registered
				</a>
			);
		}

		return courses.map((course) => (
			<a
				href={"/students/courses/" + course.code}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{course.code} - {course.name}
			</a>
		));
	};

	render() {
		return (
			<div class="StudentMenu">
				<NavBar />
				<div id="container">
					<h1 id="title">Student Menu</h1>
					<div class="row">
						<div class="col-6">
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
											Courses
										</button>
									</h2>
									<div
										id="courses-data"
										class="accordion-collapse collapse"
										aria-labelledby="courses-heading"
										data-bs-parent="#courses-accordion"
									>
										<div class="list-group">
											<a
												href="/students/courses/"
												class="list-group-item list-group-item-action"
												aria-current="true"
											>
												Enroll Course
											</a>
											{this.displayCourses(
												this.state.courses
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-6">
							<div class="accordion" id="tmachines-accordion">
								<div class="accordion-item">
									<h2
										class="accordion-header"
										id="tmachines-heading"
									>
										<button
											type="button"
											class="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#tmachines-data"
										>
											Turing Machines
										</button>
									</h2>
									<div
										id="tmachines-data"
										class="accordion-collapse collapse"
										aria-labelledby="tmachines-heading"
										data-bs-parent="#tmachines-accordion"
									>
										<div class="list-group">
											<a
												href="/students/tmachines/"
												class="list-group-item list-group-item-action"
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
