import React, { Component } from "react";
import { axios, swal } from "../dependencies";

class Login extends Component {
	state = {
		email: "",
		password: "",
		isTeacher: false,
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
			isTeacher: !this.state.isTeacher,
		});
	};

	submit = (event) => {
		event.preventDefault();
		console.log(process.env);
		if (this.state.email === "" || this.state.password === "") {
			swal.fire({
				title: "You must fill all fields",
				icon: "warning",
				iconColor: "red",
				background: "black",
				color: "white",
			});
			return;
		}

		let isTeacher = this.state.isTeacher ? "/teachers" : "/students";
		const apiUrl = "/api" + isTeacher + "/login";

		axios({
			url: apiUrl,
			method: "POST",
			data: {
				email: this.state.email,
				password: this.state.password,
			},
		})
			.then((res) => {
				if (res.data.success) {
					localStorage.setItem("id", res.data.data.id);
					window.location = isTeacher + "/menu";
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
			<div className="Login">
				<div id="container">
					<p id="title">User info</p>
					<div id="loginbox">
						<form id="loginform" onSubmit={this.submit}>
							<label for="email">Email</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">
										<i class="fa fa-user" />
									</span>
								</div>
								<input
									type="email"
									class="form-control"
									id="email"
									placeholder="email@example.com"
									name="email"
									aria-label="Username (email)"
									onChange={this.handleChange}
									value={this.state.email}
								/>
							</div>
							<label for="password">Password</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">
										<i class="fa fa-lock"></i>
									</span>
								</div>
								<input
									type="password"
									class="form-control"
									id="password"
									name="password"
									aria-label="User Password"
									onChange={this.handleChange}
									value={this.state.password}
								/>
							</div>
							<div class="form-check form-switch">
								<input
									class="form-check-input"
									type="checkbox"
									id="isTeacher"
									aria-label="Teacher Switch"
									onChange={this.handleSwitchChange}
									value={this.state.isTeacher}
								/>
								<label
									class="form-check-label"
									id="teacher-label"
									for="isTeacher"
								>
									I'm a teacher!
								</label>
							</div>
							<button type="submit" className="btn btn-primary">
								Login
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
