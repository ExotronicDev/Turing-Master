import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class StudentCourse extends Component {
	state = {
		code: "",
		name: "",
		exercises: [],
		loggedId: "",
	};

	componentDidMount = () => {
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

	getInfo = () => {
		// let apiUrl = "/api/courses/" + this.state.loggedId + "/courses";
		// axios({
		// 	url: "/api/auth/me",
		// 	method: "GET",
		// })
		// 	.then((res) => {
		// 		const isProfessor =
		// 			res.data.role === "professors" ? true : false;
		// 		this.setState({
		// 			firstName: res.data.data.firstName,
		// 			lastName: res.data.data.lastName,
		// 			id: res.data.data.id,
		// 			email: res.data.data.email,
		// 			password: res.data.data.password,
		// 			isProfessor: isProfessor,
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		swal.fire({
		// 			title: "Oops !",
		// 			text: "Unexpected error, Try Again",
		// 			icon: "error",
		// 			background: "black",
		// 			color: "white",
		// 		});
		// 	});
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

	render() {
		return (
			<div class="StudentCourse">
				<NavBar />
				<div id="container">
					<h1 id="title">Course</h1>
				</div>
			</div>
		);
	}
}

export default StudentCourse;
