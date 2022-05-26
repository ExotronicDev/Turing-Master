import React, { Component } from "react";
import { Cookies } from "../dependencies";

class Home extends Component {
	componentDidMount = () => {
		Cookies.remove("token");
	};

	render() {
		return (
			<div className="Home">
				<div id="container">
					<h1 className="title">Turing Master</h1>
					<div id="background"></div>
					<div id="options">
						<form action="/login">
							<button
								id="login"
								type="submit"
								className="btn btn-primary btn-lg"
							>
								{" "}
								Login{" "}
							</button>
						</form>
						<form action="/register">
							<button
								id="register"
								type="submit"
								className="btn btn-primary btn-lg"
							>
								{" "}
								Register{" "}
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
