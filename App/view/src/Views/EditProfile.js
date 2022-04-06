import axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert2";

class EditProfile extends Component {
	state = {
		firstName: "",
		lastName: "",
		id: "",
		email: "",
		password: "",
		oldPassword: "",
		newPassword: "",
		confirm: "",
	};

	componentDidMount = async () => {
		await this.getInfo();
	};

	getInfo = () => {
		axios({
			url: "/api/students/" + localStorage.getItem("id"),
			method: "GET",
		})
			.then((res) => {
				this.setState({
					firstName: res.data.data.firstName,
					lastName: res.data.data.lastName,
					id: localStorage.getItem("id"),
					email: res.data.data.email,
					password: res.data.data.password,
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Oops !",
					text: "Unexpected error, Try Again",
					icon: "error",
					background: "black",
					color: "white",
				});
			});
	};

	//Función que actualiza los states
	handleChange = (event) => {
		const target = event.target;
		const name = target.name;
		const value = target.value;

		this.setState({
			[name]: value,
		});
	};

	change = () => {
		if (document.getElementById("checkF").checked) {
			document.getElementById("firstName").disabled = "";
		}
		if (document.getElementById("check2").checked) {
			document.getElementById("lastName").disabled = "";
		}
		if (document.getElementById("check3").checked) {
			document.getElementById("email").disabled = "";
		}
		if (document.getElementById("check4").checked) {
			document.getElementById("password").disabled = "";
			document.getElementById("newpassword").disabled = "";
			document.getElementById("oldpassword").disabled = "";
		}
		if (!document.getElementById("checkF").checked) {
			document.getElementById("firstName").disabled = "disabled";
		}
		if (!document.getElementById("check2").checked) {
			document.getElementById("lastName").disabled = "disabled";
		}
		if (!document.getElementById("check3").checked) {
			document.getElementById("email").disabled = "disabled";
		}
		if (!document.getElementById("check4").checked) {
			document.getElementById("password").disabled = "disabled";
			document.getElementById("newpassword").disabled = "disabled";
			document.getElementById("oldpassword").disabled = "disabled";
		}
	};

	submit = (event) => {
		event.prevenDefault();

		if (this.state.password !== this.state.oldPassword) {
			swal.fire({
				title: "Warning!",
				text: "Old Password doesn´t match !",
				icon: "warning",
				background: "black",
				color: "white",
			});
		}
	};

	render() {
		return (
			<div className="EditProfile">
				<p id="title"> Your information</p>
				<form onSubmit={this.submit}>
					<div className="form-group row">
						<label for="firstName">First Name</label>
						<div className="col">
							<input
								type="text"
								className="form-control"
								id="firstName"
								placeholder="First Name"
								name="firstName"
								onChange={this.handleChange}
								value={this.state.firstName}
								disabled="disabled"
							/>
						</div>
						<div className="col" id="edit">
							<label for="check">Edit</label>
						</div>
						<div className="col" id="check">
							<input
								id="checkF"
								type="checkbox"
								onChange={this.change}
							></input>
						</div>
					</div>

					<div className="form-group row">
						<label for="lastName">Last Name</label>
						<div className="col">
							<input
								type="text"
								className="form-control"
								id="lastName"
								placeholder="Last Name"
								name="lastName"
								onChange={this.handleChange}
								value={this.state.lastName}
								disabled="disabled"
							/>
						</div>
						<div className="col" id="edit">
							<label for="check">Edit</label>
						</div>
						<div className="col" id="check">
							<input
								id="check2"
								type="checkbox"
								onChange={this.change}
							></input>
						</div>
					</div>

					<div className="form-group row">
						<label for="email">Email</label>
						<div className="col">
							<input
								type="email"
								className="form-control"
								id="email"
								placeholder="email@example.com"
								name="email"
								onChange={this.handleChange}
								value={this.state.email}
								disabled="disabled"
							/>
						</div>
						<div className="col" id="edit">
							<label for="check">Edit</label>
						</div>
						<div className="col" id="check">
							<input
								id="check3"
								type="checkbox"
								onChange={this.change}
							></input>
						</div>
					</div>
					<div className="form-group row">
						<label for="email">Password</label>
						<div className="col">
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Old Password"
								name="password"
								onChange={this.handleChange}
								value={this.state.password}
								disabled="disabled"
							/>
						</div>
						<div className="col" id="edit">
							<label for="check">Edit</label>
						</div>
						<div className="col" id="check">
							<input
								id="check4"
								type="checkbox"
								onChange={this.change}
							></input>
						</div>
					</div>
					<div className="form-group row">
						<label for="email">New Password</label>
						<div className="col">
							<input
								type="password"
								className="form-control"
								id="newpassword"
								placeholder="New Password"
								name="newpassword"
								onChange={this.handleChange}
								value={this.state.newPassword}
								disabled="disabled"
							/>
						</div>
					</div>
					<div className="form-group row">
						<label for="email">Confirm</label>
						<div className="col">
							<input
								type="password"
								className="form-control"
								id="confirm"
								placeholder="Confirm Password"
								name="confirm"
								onChange={this.handleChange}
								value={this.state.confirm}
								disabled="disabled"
							/>
						</div>
					</div>
					<button
						type="submit"
						className="btn btn-primary"
						style={{ marginTop: "20px", width: "200px" }}
					>
						Save Changes
					</button>
				</form>
			</div>
		);
	}
}

export default EditProfile;
