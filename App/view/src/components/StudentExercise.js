import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class StudentExercise extends Component {
	state = {
		// name: "",
		// description: "",
		// inputDescription: "",
		// outputDescription: "",
		// exampleCases: [],
		// loggedId: "",
		name: "Validate Email",
		description:
			"Create a Turing Machine that validates if an email has correct syntaxis",
		inputDescription: "An email string to validate with the machine",
		outputDescription: "A final state which accepts the email introduced",
		exampleCases: [
			{
				number: 1,
				input: "agusbrenesgmail.com",
				output: "false",
			},
			{
				number: 2,
				input: "agusbrenesu@gmail.com",
				output: "true",
			},
		],
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
		// 	url: "/api//me",
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
			<div class="StudentExercise">
				<NavBar />
				<div id="container">
					<h1 id="title">{this.state.name}</h1>
				</div>
			</div>
		);
	}
}

export default StudentExercise;
