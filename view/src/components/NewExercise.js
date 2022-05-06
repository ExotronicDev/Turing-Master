import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class NewExercise extends Component {
	state = {
		examples: [],
		tests: [],
		name: "",
		description: "",
		inputDescription: "",
		outputDescription: "",
		code: "",
		loggedId: "",
	};

	componentDidMount = () => {
		this.setLoggedId();
		this.setCourseCode();
		//this.getInfo();
	};

	//Función que actualiza los states
	handleChange = (event) => {
		const target = event.target;
		const id = target.id;
		const value = target.value;

		this.setState({
			[id]: value,
		});
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
				window.location = "/professors/menu";
			});
		}
		courseCode = courseCode.substring(0, end);
		this.state.code = courseCode;
	}

	displayExampleCases = (exampleCases) => {
		if (exampleCases.length === 0) {
			return (
				<th id="noCases" scope="row" colSpan="3">
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

	displayTestCases = (testCases) => {
		if (testCases.length === 0) {
			return (
				<th id="noCases" scope="row" colSpan="3">
					No test cases given
				</th>
			);
		}

		return testCases.map((test) => (
			<tr>
				<th scope="row">{test.number}</th>
				<td>{test.input}</td>
				<td>{test.output}</td>
			</tr>
		));
	};

	addExample = (event) => {
		event.preventDefault();
		swal.fire({
			title: "Fill the Example information",
			html:
				'<input id="swal-input1" class="swal2-input" placeholder="Example Input">' +
				'<input id="swal-input2" class="swal2-input" placeholder="Example Output">',
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then(() => {
			const example = {
				number: this.state.examples.length + 1,
				input: document.getElementById("swal-input1").value,
				output: document.getElementById("swal-input2").value,
			};

			this.state.examples.push(example);
			this.forceUpdate();
		});
	};

	addTest = (event) => {
		event.preventDefault();
		swal.fire({
			title: "Fill the Test information",
			html:
				'<input id="swal-input1" class="swal2-input" placeholder="Test Input">' +
				'<input id="swal-input2" class="swal2-input" placeholder="Test Output">',
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then((result) => {
			const test = {
				number: this.state.tests.length + 1,
				input: document.getElementById("swal-input1").value,
				output: document.getElementById("swal-input2").value,
			};

			this.state.tests.push(test);
			this.forceUpdate();
		});
	};

	save = (event) => {
		event.preventDefault();

		if (
			this.state.name === "" ||
			this.state.description === "" ||
			this.state.inputDescription === "" ||
			this.state.outputDescription === ""
		) {
			return swal.fire({
				title: "Error!",
				text: "You must Fill all the entries !",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		if (this.state.examples.length === 0 || this.state.tests.length === 0) {
			return swal.fire({
				title: "Error!",
				text: "You must enter at least one Example and Test !",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		const exercise = {
			name: this.state.name,
			description: this.state.description,
			inputDescription: this.state.inputDescription,
			outputDescription: this.state.outputDescription,
			exampleCases: this.state.examples,
			testCases: this.state.tests,
		};

		axios({
			url: "/api/courses/" + this.state.code + "/exercises",
			method: "POST",
			data: exercise,
		})
			.then(() => {
				swal.fire({
					title: "Success!",
					text: "Exercise has been added successfully !",
					icon: "success",
					background: "black",
					color: "white",
				}).then(() => {
					window.location = "/professors/course/" + this.state.code;
				});
			})
			.catch(() => {
				swal.fire({
					title: "Oops !",
					text: "Unexpected error, Try Again",
					icon: "error",
					background: "black",
					color: "white",
				});
			});
	};

	render() {
		return (
			<div id="form-view" className="NewExercise">
				<NavBar />
				<div id="container">
					<h1 id="title"> Fill the Exercise Information</h1>
					<div id="box">
						<form id="boxform" onSubmit={this.save}>
							<label for="name">Exercise Name</label>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									id="name"
									onChange={this.handleChange}
									value={this.state.name}
								/>
							</div>

							<label for="description">Description</label>
							<div className="form-group">
								<textarea
									type="text"
									className="form-control"
									id="description"
									onChange={this.handleChange}
									value={this.state.description}
								/>
							</div>

							<label for="inputDescription">Expected input</label>
							<div className="form-group">
								<textarea
									type="text"
									className="form-control"
									id="inputDescription"
									//aria-label="Expected input description"
									onChange={this.handleChange}
									value={this.state.inputDescription}
								/>
							</div>

							<label for="outputDescription">
								Expected output
							</label>
							<div className="form-group">
								<textarea
									type="text"
									className="form-control"
									id="outputDescription"
									aria-label="Expected output description"
									onChange={this.handleChange}
									//value={this.state.outputDescription}
								/>
							</div>

							<label for="exapleTable">Examples</label>
							<table
								id="exapleTable"
								className="table table-secondary"
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
										this.state.examples
									)}
								</tbody>
							</table>
							<div className="form-group">
								<button
									id="add"
									onClick={this.addExample}
									className="btn btn-primary"
								>
									Add Example
								</button>
							</div>

							<label for="exapleTable">Test Cases</label>
							<table
								id="exapleTable"
								className="table table-secondary"
							>
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Input</th>
										<th scope="col">Output</th>
									</tr>
								</thead>
								<tbody>
									{this.displayTestCases(this.state.tests)}
								</tbody>
							</table>
							<div className="form-group">
								<button
									id="add"
									onClick={this.addTest}
									className="btn btn-primary"
								>
									Add Case
								</button>
							</div>
							<button
								id="save"
								type="submit"
								className="btn btn-primary"
							>
								Save Exercise
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default NewExercise;
