import React, { Component } from "react";
import Cookies from "js-cookie";

class MainView extends Component {
	componentDidMount = () => {
		const token = Cookies.get("token");
		if (token === undefined) {
			window.location = "/login/student";
		}
	};

	render() {
		return (
			<div className="MainView">
				<p>Turing Machine Simulator</p>
				<form action="/TuringIO">
					<button
						id="newmachine"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						New Machine{" "}
					</button>
				</form>
				<form action="/MachinesList">
					<button
						id="mymachines"
						type="submit"
						className="btn btn-primary btn-lg"
					>
						{" "}
						View My Machines{" "}
					</button>
				</form>
				<form action="/EditProfile">
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
