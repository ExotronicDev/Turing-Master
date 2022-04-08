import React, { Component } from "react";
import { Cookies } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class StudentMenu extends Component {
	componentDidMount = () => {
		const token = Cookies.get("token");
		if (token === undefined) {
			window.location = "/login";
		}
	};

	render() {
		return (
			<div class="StudentMenu">
				<NavBar />
				<div id="container">
					<h1 id="title">Student Menu</h1>
					<form action="/TuringIO">
						<button
							id="newmachine"
							type="submit"
							class="btn btn-primary btn-lg"
						>
							{" "}
							New Machine{" "}
						</button>
					</form>
					<form action="/MachinesList">
						<button
							id="mymachines"
							type="submit"
							class="btn btn-primary btn-lg"
						>
							{" "}
							View My Machines{" "}
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default StudentMenu;
