import React, { Component } from "react";
//import axios from "axios";

const swal = require('sweetalert2')


class Register extends Component {
	state = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirm: ""
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

        if (this.state.firstName === "" || this.state.lastName === "" || this.state.email === "" || this.state.password === "" || this.state.confirm === "" ){
            swal.fire({
                title: 'You must fill all fields',
                icon: 'warning',
				iconColor: "red",
				background: "black"
            })
            return;
        }

        if (this.state.password !== this.state.confirm){
            swal.fire({
                title: "Password doesn't match",
                icon: 'warning',
				iconColor: "red",
				background: "black"
            })
            return;
        }

		window.location = "/TuringMachineSimulator"
	}

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
