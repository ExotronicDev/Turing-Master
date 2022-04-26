import React, { Component } from "react";
import { Cookies, axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class ProfessorCourse extends Component {
	state = {};

	componentDidMount = () => {
		const token = Cookies.get("token");
		if (token === undefined) {
			window.location = "/login";
		}

		this.getTMachines();
	};

	render() {
		return (
			<div class="ProfessorCourse">
				<NavBar />
				<div id="container">
					<h1 id="title">Course</h1>
				</div>
			</div>
		);
	}
}

export default ProfessorCourse;
