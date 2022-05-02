import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class ProfessorExercise extends Component {
    state = {
        name: "",
        description: "",
        examples: [],
        tests: []
    }

    componentDidMount = () => {

    }

    editExample = () => {

    }

    displayExamples = (examples) => {
		return examples.map((example) => (
			<a
				//onClick={this.editExample}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{/*
                #{example.number} Input: {example.input} - Output: {example.output}
                */}
			</a>
		));
    }

    displayTests = (tests) => {
		return tests.map((example) => (
			<a
				//onClick={this.editTest}
				class="list-group-item list-group-item-action"
				aria-current="true"
			>
				{/*
                #{test.number} Input: {test.input} - Output: {test.output}
                */}
			</a>
		));
    }

    save = () => {

    }

    render() {
        return (
            <div className="ProfessorCourse">
				<NavBar />
                <div id="container">
                    <h1 id="title"> Exercise Information</h1>
                    <div class="form-group row align-items-end justify-content-end">
                        <form id="boxform" onSubmit={this.save}>
                            <div class="form-group row align-items-end justify-content-end">
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
                            </div>

                            <div class="form-group row align-items-end justify-content-end">
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

                            <div class="form-group row align-items-end justify-content-end">
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
                                    <label for="check4">Edit</label>
                                </div>
                                <div class="col-1" id="check">
                                    <input
                                        id="check4"
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
            </div>  
        )
    }
}

export default ProfessorExercise;