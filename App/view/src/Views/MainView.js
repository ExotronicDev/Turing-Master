import React, { Component } from "react";

class MainView extends Component {
	render() {
		return (
			<div className="MainView">
				<p>Turing Machine Simulator</p>
				<form action="">
					<button
						id="newmachine"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						New Machine{" "}
					</button>
				</form>
				<form action="/TuringMachineSimulator/MachinesList">
					<button
						id="mymachines"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						View My Machines{" "}
					</button>
				</form>
				<form action="">
					<button
						id="edit"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						Edit my Profile{" "}
					</button>
				</form>
			</div>
		);
	}
}

export default MainView;
