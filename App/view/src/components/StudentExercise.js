import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class StudentExercise extends Component {
	state = {
		name: "",
		description: "",
		inputDescription: "",
		outputDescription: "",
		exampleCases: [],
		courseCode: "",
		loggedId: "",
	};

	componentDidMount = () => {
		this.setLoggedId();
		this.setCourseCode();
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
		const searchString = "/students/course/";
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
				window.location = "/students/menu";
			});
		}
		// length of "/students/course/", so searches next to it
		start += searchString.length;
		courseCode = currentUrl.substring(start);

		// find first "/" after slicing string
		const end = courseCode.indexOf("/");
		if (end === -1) {
			swal.fire({
				title: "Oops !",
				text: "Invalid URL.",
				icon: "error",
				background: "black",
				color: "white",
			}).then(() => {
				window.location = "/students/menu";
			});
		}

		courseCode = courseCode.substring(0, end);
		this.state.courseCode = courseCode;
	}

	getInfo = () => {
		let apiUrl = "/api/courses/" + this.state.courseCode + "/exercises";
		axios({
			url: apiUrl,
			method: "GET",
		})
			.then((res) => {
				const exampleCases = res.data.data.exampleCases.map(
					(example) => ({
						number: example.number,
						input: example.input,
						output: example.output,
					})
				);
				this.setState({
					exampleCases: exampleCases,
					name: res.data.data.name,
					description: res.data.data.description,
					inputDescription: res.data.data.inputDescription,
					outputDescription: res.data.data.outputDescription,
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Oops !",
					text: "Could not get Exercise data.",
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

	displayExampleCases = (exampleCases) => {
		if (exampleCases.length === 0) {
			return (
				<th id="noCases" scope="row" colspan="3">
					No example cases given
				</th>
			);
		}

		return exampleCases.map((example) => (
			<tr>
				<th scope="row">{example.number}</th>
				<td>{example.input}</td>
				<td>{example.output}</td>
			</tr>
		));
	};

	render() {
		return (
			<div id="form-view" class="StudentExercise">
				<NavBar />
				<div id="container">
					<h1 id="title">{this.state.name}</h1>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<p>{this.state.description}</p>
							{/* <div class="form-group">
								<input
									type="text"
									class="form-control"
									id="code"
									placeholder="Code"
									name="code"
									aria-label="Code for the new course"
									onChange={this.handleChange}
									value={this.state.description}
									disabled="disabled"
								/>
							</div> */}

							<label for="inputDescription">Expected input</label>
							<div class="form-group">
								<input
									type="text"
									class="form-control"
									id="inputDescription"
									aria-label="Expected input description"
									value={this.state.inputDescription}
									disabled="disabled"
								/>
							</div>

							<label for="outputDescription">
								Expected output
							</label>
							<div class="form-group">
								<input
									type="text"
									class="form-control"
									id="outputDescription"
									aria-label="Expected output description"
									value={this.state.outputDescription}
									disabled="disabled"
								/>
							</div>

							<label for="exapleTable">Examples</label>
							<table
								id="exapleTable"
								class="table table-secondary"
							>
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Input</th>
										<th scope="col">Output</th>
									</tr>
								</thead>
								<tbody>
									{this.displayExampleCases(
										this.state.exampleCases
									)}
								</tbody>
							</table>

							<button
								id="solve"
								type="submit"
								class="btn btn-primary"
							>
								Solve Exercise
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default StudentExercise;