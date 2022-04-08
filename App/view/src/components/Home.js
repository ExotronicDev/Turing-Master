import React, { Component } from "react";
import { Cookies } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class Home extends Component {
	componentDidMount = () => {
		Cookies.remove("token");
	};

	render() {
		return (
			<div class="Home">
				<NavBar />
				<div id="container">
					<h1 class="title">Turing Master</h1>
					{/* {<img
							src="../TitleBackground.png"
							alt="Turing Machine tape"
							width="2100"
							height="295"
						></img>} */}
					<div id="background"></div>
					<div id="options">
						<form action="/login">
							<button
								id="login"
								type="submit"
								class="btn btn-primary btn-lg"
							>
								{" "}
								Login{" "}
							</button>
						</form>
						<form action="/register">
							<button
								id="register"
								type="submit"
								class="btn btn-primary btn-lg"
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
