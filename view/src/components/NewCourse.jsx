import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";
import roleChecker from "./Routes/roleChecker";

class NewCourse extends Component {
	state = {
		code: "",
		name: "",
		loggedId: "",
	};

	componentDidMount = () => {
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
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value,
		});
	};

	submit = (event) => {
		event.preventDefault();

		if (this.state.code === "" || this.state.name === "") {
			swal.fire({
				title: "You must fill all fields",
				icon: "warning",
				iconColor: "red",
				background: "black",
				color: "white",
			});
			return;
		}

		var course = {
			code: this.state.code,
			name: this.state.name,
		};

		axios({
			url: "/api/courses/",
			method: "POST",
			data: course,
		})
			.then((res) => {
				if (res.data.success) {
					swal.fire({
						title: "Success!",
						text: "Course has been created successfully!",
						icon: "success",
						background: "black",
						color: "white",
					}).then(() => {
						window.location = "/professors/menu";
					});
				} else {
					swal.fire({
						title: "Error!",
						text: res.data.error,
						icon: "warning",
						background: "black",
						color: "white",
					});
				}
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
			<div id="form-view" class="NewCourse">
				<NavBar />
				<div id="container">
					<p id="title">Fill in the information for the new Course</p>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<label for="firstName">Course Code</label>
							<div class="form-group">
								<input
									type="text"
									class="form-control"
									id="code"
									placeholder="Code"
									name="code"
									aria-label="Code for the new course"
									onChange={this.handleChange}
									value={this.state.code}
								/>
							</div>

							<label for="lastName">Course Name</label>
							<div class="form-group">
								<input
									type="text"
									class="form-control"
									id="name"
									placeholder="Name"
									name="name"
									aria-label="Name for the new course"
									onChange={this.handleChange}
									value={this.state.name}
								/>
							</div>

							<button
								id="create"
								type="submit"
								class="btn btn-primary"
							>
								Create Course
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default NewCourse;
