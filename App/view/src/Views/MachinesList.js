import React, { Component } from "react";

class Login extends Component {
	render() {
		return (
			<div className="TMList">
				<p id="title">Turing Machines List</p>
				<form id="form">
					<div class="form-group">
						<label for="email">Email</label>
						<div className="form-group">
							<input
								type="email"
								className="form-control"
								id="email"
								placeholder="email@example.com"
								name="email"
							/>
						</div>
					</div>
					<div class="form-group">
						<label>Password</label>
						<div className="form-group">
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
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
