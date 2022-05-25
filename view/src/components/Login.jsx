import React, { Component } from "react";
import { axios, swal } from "../dependencies";

class Login extends Component {
	state = {
		email: "",
		password: "",
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

		let isProfessor = this.state.isProfessor ? "/professors" : "/students";
		const apiUrl = "/api" + isProfessor + "/login";

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
					window.location = isProfessor + "/menu";
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
			<div id="form-view" class="Login">
				<div id="container">
					<p id="title">User info</p>
					<div id="box">
						<form id="boxform" onSubmit={this.submit}>
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
									aria-label="Your username (email)"
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
									aria-label="Your user password"
									onChange={this.handleChange}
									value={this.state.password}
								/>
							</div>

							<div class="form-check form-switch">
								<input
									class="form-check-input"
									type="checkbox"
									id="isProfessor"
									aria-label="Professor Switch"
									onChange={this.handleSwitchChange}
									value={this.state.isProfessor}
								/>
								<label
									class="form-check-label"
									id="professor-label"
									for="isProfessor"
								>
									I'm a professor!
								</label>
							</div>

							<button type="submit" class="btn btn-primary">
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
