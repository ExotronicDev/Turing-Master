import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class ProfessorMenu extends Component {
	state = {
		courses: [],
		loggedId: roleChecker.getLoggedId(),
	};

	componentDidMount = () => {
		this.getCourses();
	};

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
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				}).then(() => {
					window.location = "/";
				});
			});
	};

	displayCourses = (courses) => {
		if (courses.length === 0) {
			return (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className="list-group-item list-group-item-action disabled">
					No Courses registered
				</a>
			);
		}

		return courses.map((course) => (
			<a
				href={"/professors/course/" + course.code}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{course.code} - {course.name}
			</a>
		));
	};

	render() {
		return (
			<div className="ProfessorMenu">
				<NavBar />
				<div id="container">
					<h1 id="title">Professor Menu</h1>
					<div className="row">
						<div className="col">
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
											<a
												href="/professors/course/"
												className="list-group-item list-group-item-action first-item"
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
