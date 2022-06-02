import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class ExerciseSolutions extends Component {
	state = {
		students: [
			{
				id: 118160369,
				firstName: "Agustín",
				lastName: "Brenes",
				solutions: [
					{
						grade: 100,
						tMachine: {
							id: 1,
							description: "Best TMachine",
						},
					},
					{
						grade: 95,
						tMachine: {
							id: 2,
							description: "Second best TMachine",
						},
					},
				],
			},
			{
				id: 2019177064,
				firstName: "Eduardo",
				lastName: "Saborío",
				solutions: [
					{
						grade: 100,
						tMachine: {
							id: 5,
							description: "Validate Email Turing Machine vFinal",
						},
					},
					{
						grade: 95,
						tMachine: {
							id: 4,
							description: "Validate Email Turing Machine v2",
						},
					},
					{
						grade: 90,
						tMachine: {
							id: 3,
							description: "Validate Email Turing Machine",
						},
					},
				],
			},
		],
	};
	// state = {
	//     students: []
	// };

	componentDidMount = () => {
		// this.getSolutions();
	};

	getSolutions = () => {
		// "course/IC4301/exercise/Validate-Email-Adress/solutions"
		const apiUrl =
			"/api/courses/" +
			this.props.match.params.code +
			"/exercise/" +
			this.props.match.params.name +
			"/solutions";
		axios({
			url: apiUrl,
			method: "GET",
		})
			.then((res) => {
				// const data = res.data.data;
				// const courses = [];
				// data.forEach((element) => {
				// 	const course = {
				// 		code: element.code,
				// 		name: element.name,
				// 	};
				// 	courses.push(course);
				// });
				this.setState({
					students: res.data.data,
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
					window.location =
						"/api/courses/" +
						this.props.match.params.code +
						"/exercise/" +
						this.props.match.params.name;
				});
			});
	};

	displayStudentSolutions = (solutions) => {
		return solutions.map((solution, index) => (
			<a
				href={"/professors/simulator/" + solution.tMachine.id}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{index + 1 + ")"} {solution.tMachine.description} - Grade:{" "}
				{solution.grade}
			</a>
		));
	};

	displayStudents = (students) => {
		return students.map((student) => {
			const accordionId = "solution-data-" + student.id;
			return (
				<div className="row">
					<div className="col">
						<div className="accordion student-accordion">
							<div className="accordion-item">
								<h2 className="accordion-header">
									<button
										type="button"
										className="accordion-button collapsed"
										data-bs-toggle="collapse"
										data-bs-target={"#" + accordionId}
									>
										{student.firstName} {student.lastName} -{" "}
										{student.id}
										{": "}
										{`(${student.solutions.length} solutions submitted)`}
									</button>
								</h2>
								<div
									id={accordionId}
									className="accordion-collapse collapse show"
									aria-labelledby="courses-heading"
									data-bs-parent="#courses-accordion"
								>
									<div className="list-group">
										{this.displayStudentSolutions(
											student.solutions
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	render() {
		return (
			<div className="ExerciseSolutions">
				<NavBar />
				<div id="container">
					<h1 id="title">
						{this.props.match.params.name.split("-").join(" ")}:
						Solutions
					</h1>
					{this.displayStudents(this.state.students)}
				</div>
			</div>
		);
	}
}

export default ExerciseSolutions;
