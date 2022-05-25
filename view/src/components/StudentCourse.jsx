import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class StudentCourse extends Component {
	state = {
		code: "",
		name: "",
		exercises: [],
	};

	componentDidMount = () => {
		this.getInfo();
	};

	getInfo = () => {
		axios({
			url: "/api/courses/" + this.props.match.params.code,
			method: "GET",
		})
			.then((res) => {
				this.setState({
					code: res.data.data.code,
					name: res.data.data.name,
					exercises: res.data.data.exercises,
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

	displayExercises = (exercises) => {
		if (exercises.length === 0) {
			return (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a className="list-group-item list-group-item-action disabled">
					No Exercises available
				</a>
			);
		}

		return exercises.map((exercise) => (
			<a
				href={
					"/students/course/" +
					this.props.match.params.code +
					"/exercise/" +
					exercise.slugName
				}
				className="list-group-item list-group-item-action"
				aria-current="true"
			>
				{exercise.name}
			</a>
		));
	};

	render() {
		return (
			<div className="StudentCourse">
				<NavBar />
				<div id="container">
					<h1 id="title">
						{this.state.code} - {this.state.name}
					</h1>
					<div className="row">
						<div className="col">
							<div className="accordion" id="exercises-accordion">
								<div className="accordion-item">
									<h2
										className="accordion-header"
										id="exercises-heading"
									>
										<button
											type="button"
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#exercises-data"
										>
											Exercises
										</button>
									</h2>
									<div
										id="exercises-data"
										className="accordion-collapse collapse show"
										aria-labelledby="exercises-heading"
										data-bs-parent="#exercises-accordion"
									>
										<div className="list-group">
											{this.displayExercises(
												this.state.exercises
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StudentCourse;
