import { React, Component } from "../dependencies";

class Home extends Component {
	render() {
		return (
			<div className="Home">
				<div id="container">
					<p className="title">Turing Master</p>
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
