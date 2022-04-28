import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class ProfessorExercise extends Component {
    state = {
        examples: [],
        tests: []
    }

    addExample = (event) => {
        event.preventDefault()
		swal.fire({
			title: "Fill the Example information",
			html:
				'<input id="swal-input1" class="swal2-input" placeholder="Example Input">' +
				'<input id="swal-input2" class="swal2-input" placeholder="Example Output">' ,
			background: "black",
			color: "white",
			confirmButtonText: 'Add',
			  customClass: {
				confirmButton: 'btn btn-success',
			},
		}).then((result) => {
			const example = {
				inputExample: document.getElementById('swal-input1').value,
				outputExample: document.getElementById('swal-input2').value,
			}

            this.state.examples.append(example);
			/* Aqui funcion para insertar ejercicios*/	

			if (result.isConfirmed) {
			  swal.fire({
				title: 'Success!',
				text: 'Exercise Added !',
				icon:'success',
				background: "black",
				color: "white",
			  })
			}
		})
	}

    addTest = (event) => {
        event.preventDefault()
		swal.fire({
			title: "Fill the Test information",
			html:
				'<input id="swal-input1" class="swal2-input" placeholder="Test Input">' +
				'<input id="swal-input2" class="swal2-input" placeholder="Test Output">' ,
			background: "black",
			color: "white",
			confirmButtonText: 'Add',
			  customClass: {
				confirmButton: 'btn btn-success',
			},
		}).then((result) => {
			const test = {
				inputExample: document.getElementById('swal-input1').value,
				outputExample: document.getElementById('swal-input2').value,
			}

            this.state.test.append(test);
			/* Aqui funcion para insertar ejercicios*/	

			if (result.isConfirmed) {
			  swal.fire({
				title: 'Success!',
				text: 'Exercise Added !',
				icon:'success',
				background: "black",
				color: "white",
			  })
			}
		})
	}

    render() {
        return (
            <div id="form-view" class="ProfessorsExercise">
				<NavBar />
				<div id="container">
                    <h1 id="title"> Fill the Exercise Information</h1>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
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
                            <label for="name"> Exercise Name</label>
                            <div class="form-group">
								<input
									type="text"
									class="form-control"
									id="name"
									//aria-label="Expected input description"
									//value={this.state.inputDescription}
								/>
							</div>

                            <label for="description">Description</label>
							<div class="form-group">
								<textarea
									type="text"
									class="form-control"
									id="description"
									//aria-label="Expected input description"
									//value={this.state.inputDescription}
								/>
							</div>

							<label for="inputDescription">Expected input</label>
							<div class="form-group">
								<textarea
									type="text"
									class="form-control"
									id="inputDescription"
									aria-label="Expected input description"
									//value={this.state.inputDescription}
								/>
							</div>

							<label for="outputDescription">
								Expected output
							</label>
							<div class="form-group">
								<textarea
									type="text"
									class="form-control"
									id="outputDescription"
									aria-label="Expected output description"
									//value={this.state.outputDescription}
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
									{//this.displayExampleCases(
										//this.state.exampleCases
									//)
                                    }
								</tbody>
							</table>
                            <div class="form-group">             
                                <button
                                    id="solve"
                                    onClick={this.addExample}
                                    class="btn btn-primary"
                                >
                                    Add Example
                                </button>
                            </div>

                            <label for="exapleTable">Test Cases</label>
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
									{//this.displayExampleCases(
										//this.state.exampleCases
									//)
                                    }
								</tbody>
							</table>
                            <div class="form-group">
                                <button
                                    id="solve"
                                    onClick={this.addTest}
                                    class="btn btn-primary"
                                >
                                    Add Case
                                </button>
                            </div>
                            <button
								id="solve"
								type="submit"
								class="btn btn-primary"
							>
								Save Exercise
							</button>
						</form>
					</div>
				</div>
			</div>
        )
    }
}

export default ProfessorExercise