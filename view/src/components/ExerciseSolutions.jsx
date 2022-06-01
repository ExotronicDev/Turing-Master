import React, { Component } from "react";
import NavBar from "./NavBar/NavBar";

class ExerciseSolutions extends Component {
	state = {};
	render() {
		return (
			<div className="ExerciseSolutions">
				<NavBar />
				<div id="container">
					<h1 id="title">
						{this.props.match.params.name}: Solutions
					</h1>
				</div>
			</div>
		);
	}
}

export default ExerciseSolutions;
