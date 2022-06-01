/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class ProfessorExercise extends Component {
	state = {
		name: "",
		description: "",
		inputDescription: "",
		outputDescription: "",
		exampleCases: [],
		testCases: [],
	};

	componentDidMount = () => {
		this.getExercise();
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

	getExercise = () => {
		axios({
			url:
				"/api/courses/" +
				this.props.match.params.code +
				"/exercises/" +
				this.props.match.params.name,
			method: "GET",
		})
			.then((res) => {
				this.setState({
					name: res.data.data.name,
					description: res.data.data.description,
					inputDescription: res.data.data.inputDescription,
					outputDescription: res.data.data.outputDescription,
					exampleCases: res.data.data.exampleCases,
					testCases: res.data.data.testCases,
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
					window.location = "/professors/menu";
				});
			});
	};

	// editExample = (number, input, output) => {
	// 	swal.fire({
	// 		title: "Example information",
	// 		html:
	// 			'<input id="swal-input1" class="swal2-input" value="' +
	// 			input +
	// 			'" placeholder="Test Input">' +
	// 			'<input id="swal-input2" class="swal2-input" value="' +
	// 			output +
	// 			'" placeholder="Test Output">',
	// 		background: "black",
	// 		color: "white",
	// 		confirmButtonText: "Add",
	// 		customClass: {
	// 			confirmButton: "btn btn-success",
	// 		},
	// 	}).then((result) => {
	// 		if (result.isConfirmed) {
	// 			const example = {
	// 				number: number,
	// 				input: document.getElementById("swal-input1").value,
	// 				output: document.getElementById("swal-input2").value,
	// 			};

	// 			this.state.exampleCases[example.number - 1] = example;
	// 			this.forceUpdate();
	// 		}
	// 	});
	// };

	// editTest = (number, input, output) => {
	// 	swal.fire({
	// 		title: "Test information",
	// 		html:
	// 			'<input id="swal-input1" class="swal2-input" value="' +
	// 			input +
	// 			'" placeholder="Test Input">' +
	// 			'<input id="swal-input2" class="swal2-input" value="' +
	// 			output +
	// 			'" placeholder="Test Output">',
	// 		background: "black",
	// 		color: "white",
	// 		confirmButtonText: "Add",
	// 		customClass: {
	// 			confirmButton: "btn btn-success",
	// 		},
	// 	}).then((result) => {
	// 		if (result.isConfirmed) {
	// 			const test = {
	// 				number: number,
	// 				input: document.getElementById("swal-input1").value,
	// 				output: document.getElementById("swal-input2").value,
	// 			};

	// 			this.state.testCases[test.number - 1] = test;
	// 			this.forceUpdate();
	// 		}
	// 	});
	// };

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

	change = () => {
		if (document.getElementById("check0").checked) {
			document.getElementById("name").disabled = "";
		}

		if (document.getElementById("check1").checked) {
			document.getElementById("description").disabled = "";
		}

		if (document.getElementById("check2").checked) {
			document.getElementById("inputDescription").disabled = "";
		}

		if (document.getElementById("check3").checked) {
			document.getElementById("outputDescription").disabled = "";
		}

		if (!document.getElementById("check0").checked) {
			document.getElementById("name").disabled = "disabled";
		}

		if (!document.getElementById("check1").checked) {
			document.getElementById("description").disabled = "disabled";
		}

		if (!document.getElementById("check2").checked) {
			document.getElementById("inputDescription").disabled = "disabled";
		}

		if (!document.getElementById("check3").checked) {
			document.getElementById("outputDescription").disabled = "disabled";
		}
	};

	seeSolutions = () =>
		(window.location =
			"/professors/course/" +
			this.props.match.params.code +
			"/exercise/" +
			this.props.match.params.name +
			"/solutions");

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
				text: "Cannot leave blank spaces!",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		const exercise = this.state;
		console.log(exercise);

		axios({
			url:
				"/api/courses/" +
				this.props.match.params.code +
				"/exercises/" +
				this.props.match.params.name,
			method: "PUT",
			data: exercise,
		})
			.then(() => {
				swal.fire({
					title: "Success!",
					text: "Exercise has been modified !",
					icon: "success",
					background: "black",
					color: "white",
				}).then(() => {
					window.location =
						"/professors/course/" + this.props.match.params.code;
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

	render() {
		return (
			<div className="ProfessorExercise">
				<NavBar />
				<div id="container">
					<h1 id="title">Exercise Information</h1>

					<form id="boxform" onSubmit={this.save}>
						<div className="form-group row justify-content-end">
							<label for="name">Name</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Name"
									name="name"
									onChange={this.handleChange}
									value={this.state.name}
									disabled="disabled"
								/>
							</div>
							<div className="col-1" id="edit">
								<label for="check1">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check0"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row justify-content-end">
							<label for="name">Description</label>
							<div className="col-8">
								<textarea
									type="text"
									className="form-control"
									id="description"
									placeholder="Description"
									name="description"
									onChange={this.handleChange}
									value={this.state.description}
									disabled="disabled"
								/>
							</div>
							<div className="col-1" id="edit">
								<label for="check1">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check1"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row justify-content-end">
							<label for="inputDescription">Expected input</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="inputDescription"
									placeholder="Expected input"
									name="inputDescription"
									onChange={this.handleChange}
									value={this.state.inputDescription}
									disabled="disabled"
								/>
							</div>
							<div className="col-1" id="edit">
								<label for="check2">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check2"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row justify-content-end">
							<label for="outputDescription">
								Expected output
							</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="outputDescription"
									placeholder="Expected output"
									name="outputDescription"
									onChange={this.handleChange}
									value={this.state.outputDescription}
									disabled="disabled"
								/>
							</div>
							<div className="col-1" id="edit">
								<label for="check3">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check3"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
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
						<table id="testTable" className="table table-secondary">
							<thead>
								<tr>
									<th scope="col">Input</th>
									<th scope="col">Output</th>
									<th scope="col">Output is State?</th>
									<th scope="col"></th>
								</tr>
							</thead>
							<tbody id="test-case-tbody">
								{this.displayTestCases(this.state.testCases)}
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
						<div className="btn-options">
							<button
								id="save"
								type="submit"
								className="btn btn-primary"
							>
								Save Changes
							</button>
						</div>
					</form>
					<div className="btn-options">
						<button
							id="seeSolutions"
							className="btn btn-primary"
							onClick={() => this.seeSolutions()}
						>
							See the submitted Solutions{" "}
							<i class="fa-solid fa-arrow-right"></i>
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfessorExercise;
