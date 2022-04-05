import React, { Component } from "react";

class Home extends Component {
	render() {
		return (
			<div className="Home">
				<p className="titulo">Turing Master</p>
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
				<form action="/TuringMachine">
					<button
						id="TMachine"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Simulator{" "}
					</button>
				</form>
			</div>
		);
	}
}

export default Home;
