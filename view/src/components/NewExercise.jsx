import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class NewExercise extends Component {
	state = {
		name: "",
		description: "",
		inputDescription: "",
		outputDescription: "",
		exampleCases: [],
		testCases: [],
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

	displayExampleCases = (exampleCases) => {
		if (exampleCases.length === 0) {
			return (
				<th id="noCases" scope="row" colSpan="4">
					No example cases given
				</th>
			);
		}

		return exampleCases.map((example) => {
			const exampleId = "example-id-" + example.number;
			return (
				<tr id={exampleId}>
					<td>{example.input}</td>
					<td>{example.output}</td>
					<td>
						{example.isState === "true" ? (
							<i class="fa fa-solid fa-check"></i>
						) : (
							<i class="fa fa-solid fa-xmark"></i>
						)}
					</td>
					<td>
						<i
							type="button"
							onClick={() => this.deleteExampleCase(example)}
							class="fa fa-solid fa-trash"
						></i>
					</td>
				</tr>
			);
		});
	};

	displayTestCases = (testCases) => {
		if (testCases.length === 0) {
			return (
				<th id="noCases" scope="row" colSpan="4">
					No test cases given
				</th>
			);
		}

		return testCases.map((test) => {
			const testId = "test-id-" + test.number;
			return (
				<tr id={testId}>
					<td>{test.input}</td>
					<td>{test.output}</td>
					<td>
						{test.isState === "true" ? (
							<i class="fa fa-solid fa-check"></i>
						) : (
							<i class="fa fa-solid fa-xmark"></i>
						)}
					</td>
					<td>
						<i
							type="button"
							onClick={() => this.deleteTestCase(test)}
							class="fa fa-solid fa-trash"
						></i>
					</td>
				</tr>
			);
		});
	};

	validateInputCase = (inputCase) => {
		if (!inputCase.input || !inputCase.output) return false;
		return true;
	};

	deleteExampleCase = (exampleCase) => {
		const rem = [exampleCase];
		this.state.exampleCases = this.state.exampleCases.filter(
			(element) => rem.indexOf(element) === -1
		);
		this.forceUpdate();
	};

	deleteTestCase = (testCase) => {
		const rem = [testCase];
		this.state.testCases = this.state.testCases.filter(
			(element) => rem.indexOf(element) === -1
		);
		this.forceUpdate();
	};

	addExample = (event) => {
		event.preventDefault();
		swal.fire({
			title: "Fill the Example information",
			html:
				'<label for="swal-input1">Example Input</label>' +
				'<input id="swal-input1" class="swal2-input" placeholder="Input">' +
				'<label for="swal-input2">Example Output</label>' +
				'<input id="swal-input2" class="swal2-input" placeholder="Output">' +
				'<label for="swal-select">Is the Output a State?</label>' +
				'<select id="swal-select" class="swal2-select">' +
				"<option value disabled>Select an option</option>" +
				"<option value=false>No</option>" +
				"<option value=true>Yes</option>" +
				"</select>",
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const example = {
					number: this.state.exampleCases.length + 1,
					input: document.getElementById("swal-input1").value,
					output: document.getElementById("swal-input2").value,
					isState: document.getElementById("swal-select").value,
				};
				if (this.validateInputCase(example)) {
					this.state.exampleCases.push(example);
					this.forceUpdate();
				} else {
					swal.fire({
						icon: "error",
						title: "Error!",
						text: "Example Case needs to have Input and Output values.",
						background: "black",
						color: "white",
					});
				}
			}
		});
	};

	addTest = (event) => {
		event.preventDefault();
		swal.fire({
			title: "Fill the Test information",
			html:
				'<label for="swal-input1">Test Input</label>' +
				'<input id="swal-input1" class="swal2-input" placeholder="Input">' +
				'<label for="swal-input2">Test Output</label>' +
				'<input id="swal-input2" class="swal2-input" placeholder="Output">' +
				'<label for="swal-select">Is the Output a State?</label>' +
				'<select id="swal-select" class="swal2-select">' +
				"<option value disabled>Select an option</option>" +
				"<option value=false>No</option>" +
				"<option value=true>Yes</option>" +
				"</select>",
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const test = {
					number: this.state.testCases.length + 1,
					input: document.getElementById("swal-input1").value,
					output: document.getElementById("swal-input2").value,
					isState: document.getElementById("swal-select").value,
				};
				if (this.validateInputCase(test)) {
					this.state.testCases.push(test);
					this.forceUpdate();
				} else {
					swal.fire({
						icon: "error",
						title: "Error!",
						text: "Test Case needs to have Input and Output values.",
						background: "black",
						color: "white",
					});
				}
			}
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
				text: "You must Fill all the entries!",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		if (
			this.state.exampleCases.length === 0 ||
			this.state.testCases.length === 0
		) {
			return swal.fire({
				title: "Error!",
				text: "You must enter at least one Example and Test!",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		const exercise = this.state;

		axios({
			url: "/api/courses/" + this.props.match.params.code + "/exercises",
			method: "POST",
			data: exercise,
		})
			.then(() => {
				swal.fire({
					title: "Success!",
					text: "Exercise has been added successfully!",
					icon: "success",
					background: "black",
					color: "white",
				}).then(() => {
					window.location =
						"/professors/course/" + this.props.match.params.code;
				});
			})
			.catch((err) => {
				if (err.response.status === 500)
					err.response.data.error = err.response.statusText;
				swal.fire({
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
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
									aria-label="Expected input description"
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
									value={this.state.outputDescription}
								/>
							</div>

							<label for="exampleTable">Example Cases</label>
							<table
								id="exampleTable"
								className="table table-secondary"
							>
								<thead>
									<tr>
										<th scope="col">Input</th>
										<th scope="col">Output</th>
										<th scope="col">Output is State?</th>
										<th scope="col"></th>
									</tr>
								</thead>
								<tbody id="example-case-tbody">
									{this.displayExampleCases(
										this.state.exampleCases
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

							<label for="testTable">Test Cases</label>
							<table
								id="testTable"
								className="table table-secondary"
							>
								<thead>
									<tr>
										<th scope="col">Input</th>
										<th scope="col">Output</th>
										<th scope="col">Output is State?</th>
										<th scope="col"></th>
									</tr>
								</thead>
								<tbody id="test-case-tbody">
									{this.displayTestCases(
										this.state.testCases
									)}
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
