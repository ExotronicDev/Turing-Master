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

		axios({
			url: "/api/students/register",
			method: "POST",
			data: user,
		})
			.then((res) => {
				if (res.data.success) {
					swal.fire({
						title: "Success!",
						text: "Your Student account has been created successfully!",
						icon: "success",
						background: "black",
						color: "white",
					}).then(() => {
						window.location = "/";
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
				console.log(err.response);
				swal.fire({
					title: "Error!",
					text: err.response.data.error,
					icon: "warning",
					background: "black",
					color: "white",
				});
				// swal.fire({
				// 	title: "Oops !",
				// 	text: "Unexpected error, Try Again",
				// 	icon: "error",
				// 	background: "black",
				// 	color: "white",
				// });
			});
	};

	render() {
		return (
			<div className="Register">
				<p id="title"> Fill in the following information</p>
				<form onSubmit={this.submit}>
					<div className="form-group">
						<label for="firstName">First Name</label>
						<input
							type="text"
							className="form-control"
							id="firstName"
							placeholder="First Name"
							name="firstName"
							onChange={this.handleChange}
							value={this.state.firstName}
						/>
					</div>

					<div className="form-group">
						<label for="lastName">Last Name</label>
						<input
							type="text"
							className="form-control"
							id="lastName"
							placeholder="Last Name"
							name="lastName"
							onChange={this.handleChange}
							value={this.state.lastName}
						/>
					</div>

					<div className="form-group">
						<label for="id">ID</label>
						<input
							type="text"
							className="form-control"
							id="id"
							placeholder="Student ID"
							name="id"
							onChange={this.handleChange}
							value={this.state.id}
						/>
					</div>

					<div className="form-group">
						<label for="email">Email</label>
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="email@example.com"
							name="email"
							onChange={this.handleChange}
							value={this.state.email}
						/>
					</div>

					<div className="form-group">
						<label for="password">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							onChange={this.handleChange}
							value={this.state.password}
						/>
						<small
							id="passwordHelpInline"
							style={{ color: "#FFFFFF" }}
						>
							Must be 8-20 characters long.
						</small>
					</div>

					<div className="form-group">
						<label for="confirm">Confirm Password</label>
						<input
							type="password"
							className="form-control"
							id="confirm"
							name="confirm"
							onChange={this.handleChange}
							value={this.state.confirm}
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary"
						style={{ marginTop: "20px", width: "200px" }}
					>
						Register
					</button>
				</form>
			</div>
		);
	}
}

export default Register;
