import React, { Component } from "react";
import { axios, swal } from "../dependencies";

class Register extends Component {
	state = {
		firstName: "",
		lastName: "",
		id: "",
		email: "",
		password: "",
		confirm: "",
		isProfessor: false,
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

	handleSwitchChange = () => {
		this.setState({
			isProfessor: !this.state.isProfessor,
		});
	};

	submit = (event) => {
		event.preventDefault();

		if (
			this.state.firstName === "" ||
			this.state.lastName === "" ||
			this.state.email === "" ||
			this.state.password === "" ||
			this.state.confirm === ""
		) {
			swal.fire({
				title: "You must fill all fields",
				icon: "warning",
				iconColor: "red",
				background: "black",
				color: "white",
			});
			return;
		}

		if (this.state.password !== this.state.confirm) {
			swal.fire({
				title: "Password doesn't match",
				icon: "warning",
				iconColor: "red",
				background: "black",
				color: "white",
			});
			return;
		}

		var user = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			id: this.state.id,
			email: this.state.email,
			password: this.state.password,
		};

		let isProfessor = this.state.isProfessor ? "/professors" : "/students";
		const apiUrl = "/api" + isProfessor + "/register";

		axios({
			url: apiUrl,
			method: "POST",
			data: user,
		})
			.then((res) => {
				if (res.data.success) {
					const accountType = isProfessor ? "Professor" : "Student";
					swal.fire({
						title: "Success!",
						text:
							"Your " +
							accountType +
							" account has been created successfully!",
						icon: "success",
						background: "black",
						color: "white",
					}).then(() => {
						window.location = "/";
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
			<div id="form-view" className="Register">
				<div id="container">
					<p id="title">Fill in your account information</p>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
							<label for="firstName">First Name</label>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									id="firstName"
									placeholder="First Name"
									name="firstName"
									aria-label="Your first name"
									onChange={this.handleChange}
									value={this.state.firstName}
								/>
							</div>

							<label for="lastName">Last Name</label>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									id="lastName"
									placeholder="Last Name"
									name="lastName"
									aria-label="Your last name"
									onChange={this.handleChange}
									value={this.state.lastName}
								/>
							</div>

							<label for="id">ID</label>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									id="id"
									placeholder="Identification"
									name="id"
									aria-label="Your identification"
									onChange={this.handleChange}
									value={this.state.id}
								/>
							</div>

							<label for="email">Email</label>
							<div className="form-group">
								<input
									type="email"
									className="form-control"
									id="email"
									placeholder="email@example.com"
									name="email"
									aria-label="Your username (email)"
									onChange={this.handleChange}
									value={this.state.email}
								/>
							</div>

							<label for="password">Password</label>
							<div className="form-group">
								<input
									type="password"
									className="form-control"
									id="password"
									name="password"
									aria-label="Your user password"
									onChange={this.handleChange}
									value={this.state.password}
								/>
								<small id="passwordHelpInline">
									Must be at least 8 characters long.
								</small>
							</div>

							<label for="confirm">Confirm Password</label>
							<div className="form-group">
								<input
									type="password"
									className="form-control"
									id="confirm"
									name="confirm"
									aria-label="Confirm your user password"
									onChange={this.handleChange}
									value={this.state.confirm}
								/>
							</div>

							<div className="form-check form-switch">
								<input
									className="form-check-input"
									type="checkbox"
									id="isProfessor"
									aria-label="Professor Switch"
									onChange={this.handleSwitchChange}
									value={this.state.isProfessor}
								/>
								<label
									className="form-check-label"
									id="professor-label"
									for="isProfessor"
								>
									I'm a professor!
								</label>
							</div>

							<button type="submit" className="btn btn-primary">
								Register
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;
