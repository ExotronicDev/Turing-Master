import React, { Component } from "react";
import { axios, swal } from "../dependencies";
import NavBar from "./NavBar/NavBar";

class Profile extends Component {
	state = {
		firstName: "",
		lastName: "",
		id: "",
		email: "",
		password: "",
		newPassword: "",
		confirmPassword: "",
		isProfessor: false,
	};

	componentDidMount = () => {
		this.getInfo();
	};

	getInfo = () => {
		axios({
			url: "/api/auth/me",
			method: "GET",
		})
			.then((res) => {
				const isProfessor =
					res.data.role === "professors" ? true : false;
				this.setState({
					firstName: res.data.data.firstName,
					lastName: res.data.data.lastName,
					id: res.data.data.id,
					email: res.data.data.email,
					password: res.data.data.password,
					isProfessor: isProfessor,
				});
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				}).then(() => {
					window.location = "/";
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
		// Save changes button
		if (
			document.getElementById("checkF").checked ||
			document.getElementById("check2").checked ||
			document.getElementById("check3").checked ||
			document.getElementById("check4").checked
		) {
			document.getElementById("save").disabled = "";
		}
		if (
			!document.getElementById("checkF").checked &&
			!document.getElementById("check2").checked &&
			!document.getElementById("check3").checked &&
			!document.getElementById("check4").checked
		) {
			document.getElementById("save").disabled = "disabled";
		}

		// Checkboxes
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
			document.getElementById("newPassword").disabled = "";
			document.getElementById("confirmPassword").disabled = "";
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
			document.getElementById("newPassword").disabled = "disabled";
			document.getElementById("confirmPassword").disabled = "disabled";
		}
	};

	saveChanges(user) {
		let isProfessor = this.state.isProfessor
			? "/professors/"
			: "/students/";
		const apiUrl = "/api" + isProfessor + this.state.id;

		axios({
			url: apiUrl,
			method: "PUT",
			data: user,
		})
			.then((res) => {
				if (res.data.success) {
					const accountType = isProfessor ? "Teacher" : "Student";
					swal.fire({
						title: "Success!",
						text:
							"Your " +
							accountType +
							" account has been updated successfully!",
						icon: "success",
						background: "black",
						color: "white",
					}).then(() => {
						window.location = isProfessor + "menu";
					});
				}
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err.response.data.error || err.response.statusText,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	}

	submit = (event) => {
		event.preventDefault();
		var user = {};

		if (document.getElementById("checkF").checked)
			user.firstName = this.state.firstName;
		if (document.getElementById("check2").checked)
			user.lastName = this.state.lastName;
		if (document.getElementById("check3").checked)
			user.email = this.state.email;

		// Verify password is being edited and matches
		if (document.getElementById("check4").checked) {
			if (this.state.newPassword !== this.state.confirmPassword) {
				swal.fire({
					title: "Warning!",
					text: "New Password doesn't match!",
					icon: "warning",
					background: "black",
					color: "white",
				});
			} else {
				user.password = this.state.password;
				user.newPassword = this.state.newPassword;
				this.saveChanges(user);
			}
		} else {
			this.saveChanges(user);
		}
	};

	render() {
		return (
			<div className="Profile">
				<NavBar />
				<div id="container">
					<p id="title"> Your information</p>
					<form onSubmit={this.submit}>
						<div className="form-group row align-items-end justify-content-end">
							<label for="firstName">First Name</label>
							<div className="col-8">
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
							<div className="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="checkF"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row align-items-end justify-content-end">
							<label for="lastName">Last Name</label>
							<div className="col-8">
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
							<div className="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check2"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>

						<div className="form-group row align-items-end justify-content-end">
							<label for="email">Email</label>
							<div className="col-8">
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
							<div className="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check3"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>
						<div className="form-group row align-items-end justify-content-end">
							<label for="email">Password</label>
							<div className="col-8">
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
							<div className="col-1" id="edit">
								<label for="check">Edit</label>
							</div>
							<div className="col-1" id="check">
								<input
									id="check4"
									type="checkbox"
									onChange={this.change}
								></input>
							</div>
						</div>
						<div className="form-group row align-items-end justify-content-center">
							<label for="email">New Password</label>
							<div className="col-8">
								<input
									type="password"
									className="form-control"
									id="newPassword"
									placeholder="New Password"
									name="newPassword"
									onChange={this.handleChange}
									value={this.state.newPassword}
									disabled="disabled"
								/>
							</div>
						</div>
						<div className="form-group row align-items-end justify-content-center">
							<label for="email">Confirm New Password</label>
							<div className="col-8">
								<input
									type="password"
									className="form-control"
									id="confirmPassword"
									placeholder="Confirm Password"
									name="confirmPassword"
									onChange={this.handleChange}
									value={this.state.confirm}
									disabled="disabled"
								/>
							</div>
						</div>
						<button
							id="save"
							type="submit"
							className="btn btn-primary"
							disabled="disabled"
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Profile;
