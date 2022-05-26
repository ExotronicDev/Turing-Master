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
				number: this.state.exampleCases.length + 1,
				input: document.getElementById("swal-input1").value,
				output: document.getElementById("swal-input2").value,
			};

			this.state.exampleCases.push(example);
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
				number: this.state.testCases.length + 1,
				input: document.getElementById("swal-input1").value,
				output: document.getElementById("swal-input2").value,
			};

			this.state.testCases.push(test);
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

							<label for="exapleTable">exampleCases</label>
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
