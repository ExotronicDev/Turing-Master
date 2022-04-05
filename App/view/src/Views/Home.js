import React, { Component } from "react";

class Home extends Component {
	render() {
		return (
			<div className="Home">
				<p className="titulo">Turing Machine Simulator</p>
				<form action="/login/teacher">
					<button
						id="teacher"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Teacher{" "}
					</button>
				</form>
				<form action="/login/student">
					<button
						id="student"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Student{" "}
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
						style={{ marginTop: "400px", width: "400px" }}
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
