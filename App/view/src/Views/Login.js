import axios from "axios";
import React, { Component } from "react";
const swal = require("sweetalert2");

class Login extends Component {
	state = {
		email: "",
		password: "",
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

		axios({
			url: "/api/v1/students/login",
			method: "POST",
			data: {
				email: this.state.email,
				password: this.state.password,
			},
		})
			.then((res) => {
				if (res.data.success) {
					localStorage.setItem("id", res.data.data.id);
					window.location = "/MainView";
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
