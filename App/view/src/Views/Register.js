import React, { Component } from "react";

class Register extends Component {
	render() {
		return (
			<div className="Register">
				<p id="title"> Fill in the following information</p>
				<form>
					<div className="form-group">
						<label for="name">First Name</label>
						<input
							type="text"
							className="form-control"
							id="name"
							placeholder="First Name"
							name="name"
						/>
					</div>

					<div className="form-group">
						<label for="lastname">Last Name</label>
						<input
							type="text"
							className="form-control"
							id="lastname"
							placeholder="Last Name"
							name="lastname"
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
						/>
					</div>

					<div className="form-group">
						<label for="password">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
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
