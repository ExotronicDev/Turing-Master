import axios from "axios";
import React, { Component } from "react";
const swal = require('sweetalert2')

class Login extends Component {
	state = {
		email: "",
		password: ""
	}

	//Función que actualiza los states
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

	submit = (event) => {
		event.preventDefault();

		axios({
            url: "/api/v1/students/login",
            method: "POST",
            data: {
				email: this.state.email,
				password: this.state.password
			}
        })
        .then( (res) => {
			if (res.data.success) {
				localStorage.setItem("id", res.data.data.id);
				window.location = "/TuringMachineSimulator/MainView"
			} else {
				swal.fire({
					title: 'Error!',
					text: res.data.error,
					icon: 'warning',
					background: "black",
					color: "white"
				})
			}
        })
        .catch( () => {
            swal.fire({
                title: 'Oops !',
                text: "Unexpected error, Try Again",
                icon: 'error',
				background: "black",
				color: "white"
            });
        })
	}
  
	render() {
		return (
			<div className="Login">
				<p id="title">User info</p>
				<form id="form" onSubmit={this.submit}>
					<div className="form-group">
						<label for="email">Email</label>
						<div className="form-group">
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
					</div>
					<div className="form-group">
						<label>Password</label>
						<div className="form-group">
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								onChange={this.handleChange}
								value={this.state.password}
							/>
						</div>
					</div>
					<button
						type="submit"
						className="btn btn-primary"
						style={{ marginTop: "20px", width: "200px" }}
					>
						Login
					</button>
				</form>
			</div>
		);
	}
}

export default Login;
