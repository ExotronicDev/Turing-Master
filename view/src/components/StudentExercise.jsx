import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class StudentExercise extends Component {
	state = {
		slugName: "",
		name: "",
		description: "",
		inputDescription: "",
		outputDescription: "",
		exampleCases: [],
	};

	componentDidMount = () => {
		// this.setExerciseName();
		this.getInfo();
	};

	getInfo = () => {
		let apiUrl =
			"/api/courses/" +
			this.props.match.params.code +
			"/exercises/" +
			this.props.match.params.name;
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
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				}).then(() => {
					window.location = "/students/menu";
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

	submit = (event) => {
		event.preventDefault();
		axios({
			url: "/api/tmachines/",
			method: "POST",
			data: { description: this.state.description },
		})
			.then((res) => {
				window.location = "/students/simulator/" + res.data.data.id;
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
			<div id="form-view" className="StudentExercise">
				<NavBar />
				<div id="container">
					<h1 id="title">{this.state.name}</h1>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<p>{this.state.description}</p>

							<label for="inputDescription">Expected input</label>
							<div className="form-group">
								<textarea
									type="text"
									className="form-control"
									id="inputDescription"
									aria-label="Expected input description"
									value={this.state.inputDescription}
									disabled="disabled"
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
									value={this.state.outputDescription}
									disabled="disabled"
								/>
							</div>

							<label for="exampleTable">Examples</label>
							<table
								id="exampleTable"
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

							<button
								id="solve"
								type="submit"
								className="btn btn-primary"
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
