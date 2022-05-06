import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class ProfessorMenu extends Component {
	state = {
		courses: [],
		loggedId: "",
	};

	componentDidMount = () => {
		this.setLoggedId();
		this.getCourses();
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

	getCourses = () => {
		let apiUrl = "/api/professors/" + this.state.loggedId + "/courses";
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
					text: err,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
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
				href={"/professors/course/" + course.code}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{course.code} - {course.name}
			</a>
		));
	};

	render() {
		return (
			<div class="ProfessorMenu">
				<NavBar />
				<div id="container">
					<h1 id="title">Professor Menu</h1>
					<div class="row">
						<div class="col">
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
										class="accordion-collapse collapse show"
										aria-labelledby="courses-heading"
										data-bs-parent="#courses-accordion"
									>
										<div class="list-group">
											<a
												href="/professors/course/"
												class="list-group-item list-group-item-action"
												aria-current="true"
											>
												Create New Course
											</a>
											{this.displayCourses(
												this.state.courses
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

export default ProfessorMenu;
