/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class ProfessorExercise extends Component {
	state = {
		name: "",
		description: "",
		expectedInput: "",
		expectedOutput: "",
		examples: [],
		tests: [],
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
					expectedInput: res.data.data.inputDescription,
					expectedOutput: res.data.data.outputDescription,
					examples: res.data.data.exampleCases,
					tests: res.data.data.testCases,
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

	editExample = (number, input, output) => {
		swal.fire({
			title: "Example information",
			html:
				'<input id="swal-input1" class="swal2-input" value="' +
				input +
				'" placeholder="Test Input">' +
				'<input id="swal-input2" class="swal2-input" value="' +
				output +
				'" placeholder="Test Output">',
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const example = {
					number: number,
					input: document.getElementById("swal-input1").value,
					output: document.getElementById("swal-input2").value,
				};

				this.state.examples[example.number - 1] = example;
				this.forceUpdate();
			}
		});
	};

	editTest = (number, input, output) => {
		swal.fire({
			title: "Test information",
			html:
				'<input id="swal-input1" class="swal2-input" value="' +
				input +
				'" placeholder="Test Input">' +
				'<input id="swal-input2" class="swal2-input" value="' +
				output +
				'" placeholder="Test Output">',
			background: "black",
			color: "white",
			confirmButtonText: "Add",
			customClass: {
				confirmButton: "btn btn-success",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				const test = {
					number: number,
					input: document.getElementById("swal-input1").value,
					output: document.getElementById("swal-input2").value,
				};

				this.state.tests[test.number - 1] = test;
				this.forceUpdate();
			}
		});
	};

	displayExamples = (examples) => {
		return examples.map((example) => (
			<a
				onClick={() => {
					this.editExample(
						example.number,
						example.input,
						example.output
					);
				}}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				#{example.number} Input: {example.input} - Output:{" "}
				{example.output}
			</a>
		));
	};

	displayTests = (tests) => {
		return tests.map((test) => (
			<a
				onClick={() => {
					this.editTest(test.number, test.input, test.output);
				}}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				#{test.number} Input: {test.input} - Output: {test.output}
			</a>
		));
	};

	change = () => {
		if (document.getElementById("check0").checked) {
			document.getElementById("name").disabled = "";
		}

		if (document.getElementById("check1").checked) {
			document.getElementById("description").disabled = "";
		}

		if (document.getElementById("check2").checked) {
			document.getElementById("expectedInput").disabled = "";
		}

		if (document.getElementById("check3").checked) {
			document.getElementById("expectedOutput").disabled = "";
		}

		if (!document.getElementById("check0").checked) {
			document.getElementById("name").disabled = "disabled";
		}

		if (!document.getElementById("check1").checked) {
			document.getElementById("description").disabled = "disabled";
		}

		if (!document.getElementById("check2").checked) {
			document.getElementById("expectedInput").disabled = "disabled";
		}

		if (!document.getElementById("check3").checked) {
			document.getElementById("expectedOutput").disabled = "disabled";
		}
	};

	save = (event) => {
		event.preventDefault();

		if (
			this.state.name === "" ||
			this.state.description === "" ||
			this.state.expectedInput === "" ||
			this.state.expectedOutput === ""
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

		axios({
			url: "/api/courses/" + this.props.match.params.code + "/exercises",
			method: "POST",
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
							<label for="expectedInput">Expected input</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="expectedInput"
									placeholder="Expected input"
									name="expectedInput"
									onChange={this.handleChange}
									value={this.state.expectedInput}
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
							<label for="expectedOutput">Expected output</label>
							<div className="col-8">
								<input
									type="text"
									className="form-control"
									id="expectedOutput"
									placeholder="Expected output"
									name="expectedOutput"
									onChange={this.handleChange}
									value={this.state.expectedOutput}
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

						<div className="form-group row align-items-end justify-content-end">
							<label for="examples-accordion">Examples</label>
							<div className="accordion" id="examples-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="examples-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#examples-data"
										>
											Examples
										</button>
									</h2>
									<div
										id="examples-data"
										className="accordion-collapse collapse show"
										aria-labelledby="examples-heading"
										data-bs-parent="#examples-accordion"
									>
										<div className="list-group">
											{this.displayExamples(
												this.state.examples
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="form-group row align-items-end justify-content-end">
							<label for="tests-accordion">Tests</label>
							<div className="accordion" id="tests-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="tests-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#tests-data"
										>
											Tests
										</button>
									</h2>
									<div
										id="tests-data"
										className="accordion-collapse collapse show"
										aria-labelledby="tests-heading"
										data-bs-parent="#tests-accordion"
									>
										<div className="list-group">
											{this.displayTests(
												this.state.tests
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<button
							id="solve"
							type="submit"
							className="btn btn-primary"
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default ProfessorExercise;