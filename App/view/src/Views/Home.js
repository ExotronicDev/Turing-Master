import React, { Component } from "react";

class Home extends Component {
	render() {
		return (
			<div className="Home">
				<p className="titulo">Turing Machine Simulator</p>
				<form action="/TuringMachineSimulator/Login/teacher">
					<button
						id="teacher"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Teacher{" "}
					</button>
				</form>
				<form action="/TuringMachineSimulator/Login/student">
					<button
						id="student"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Student{" "}
					</button>
				</form>
				<form action="/TuringMachineSimulator/Register">
					<button
						id="register"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Register{" "}
					</button>
				</form>
				<form action="/TuringMachineSimulator/TuringMachine">
					<button
						id="Simulator"
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
