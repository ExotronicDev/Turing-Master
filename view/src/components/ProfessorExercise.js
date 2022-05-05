import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";
import { useParams } from "react-router-dom";

class ProfessorExercise extends React.Component {
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
		this.setLoggedId();
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
				class="list-group-item list-group-item-action"
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
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				#{test.number} Input: {test.input} - Output: {test.output}
			</a>
		));
	};

	change = () => {
		if (document.getElementById("check1").checked) {
			document.getElementById("description").disabled = "";
		}

		if (document.getElementById("check2").checked) {
			document.getElementById("expectedInput").disabled = "";
		}

		if (document.getElementById("check3").checked) {
			document.getElementById("expectedOutput").disabled = "";
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
			this.state.description === "" ||
			this.state.expectedInput === "" ||
			this.state.expectedOutput === ""
		) {
			return swal.fire({
				title: "Error!",
				text: "Cannot leave blank spaces !",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}

		const exercise = {
			name: this.state.name,
			description: this.state.description,
			inputDescription: this.state.expectedInput,
			outputDescription: this.state.expectedOutput,
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
					text: "Exercise has been modified !",
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
			<div className="ProfessorExercise">
				<NavBar />
				<div id="container">
					<h1 id="title"> Exercise Information</h1>

					<form id="boxform" onSubmit={this.save}>
						<div class="form-group row justify-content-end">
							<label for="name">Name</label>
							<div class="col-8">
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder="Name"
									name="name"
									onChange={this.handleChange}
									value={this.state.name}
									disabled="disabled"
								/>
							</div>
							<div class="col-1" id="edit">
								<label for="check1">Edit</label>
							</div>
							<div class="col-1" id="check">
								<input
									id="check0"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div class="form-group row justify-content-end">
							<label for="name">Description</label>
							<div class="col-8">
								<textarea
									type="text"
									class="form-control"
									id="description"
									placeholder="Description"
									name="description"
									onChange={this.handleChange}
									value={this.state.description}
									disabled="disabled"
								/>
							</div>
							<div class="col-1" id="edit">
								<label for="check1">Edit</label>
							</div>
							<div class="col-1" id="check">
								<input
									id="check1"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div class="form-group row justify-content-end">
							<label for="expectedInput">Expected input</label>
							<div class="col-8">
								<input
									type="text"
									class="form-control"
									id="expectedInput"
									placeholder="Expected input"
									name="expectedInput"
									onChange={this.handleChange}
									value={this.state.expectedInput}
									disabled="disabled"
								/>
							</div>
							<div class="col-1" id="edit">
								<label for="check2">Edit</label>
							</div>
							<div class="col-1" id="check">
								<input
									id="check2"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div class="form-group row justify-content-end">
							<label for="expectedOutput">Expected output</label>
							<div class="col-8">
								<input
									type="text"
									class="form-control"
									id="expectedOutput"
									placeholder="Expected output"
									name="expectedOutput"
									onChange={this.handleChange}
									value={this.state.expectedOutput}
									disabled="disabled"
								/>
							</div>
							<div class="col-1" id="edit">
								<label for="check3">Edit</label>
							</div>
							<div class="col-1" id="check">
								<input
									id="check3"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div class="form-group row align-items-end justify-content-end">
							<label for="examples-accordion">Examples</label>
							<div class="accordion" id="examples-accordion">
								<div class="accordion-item">
									<h2
										class="accordion-header"
										id="examples-heading"
									>
										<button
											type="button"
											class="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#examples-data"
										>
											Examples
										</button>
									</h2>
									<div
										id="examples-data"
										class="accordion-collapse collapse show"
										aria-labelledby="examples-heading"
										data-bs-parent="#examples-accordion"
									>
										<div class="list-group">
											{this.displayExamples(
												this.state.examples
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="form-group row align-items-end justify-content-end">
							<label for="tests-accordion">Tests</label>
							<div class="accordion" id="tests-accordion">
								<div class="accordion-item">
									<h2
										class="accordion-header"
										id="tests-heading"
									>
										<button
											type="button"
											class="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#tests-data"
										>
											Test
										</button>
									</h2>
									<div
										id="tests-data"
										class="accordion-collapse collapse show"
										aria-labelledby="tests-heading"
										data-bs-parent="#tests-accordion"
									>
										<div class="list-group">
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

export default withRouter(ProfessorExercise);

export function withRouter(Children) {
	return (props) => {
		const match = { params: useParams() };
		return <Children {...props} match={match} />;
	};
}
