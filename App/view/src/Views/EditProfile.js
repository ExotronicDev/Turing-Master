import axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert2";

class EditProfile extends Component {
	state = {
		firstName: "",
		lastName: "",
		id: "",
		email: "",
	}

	componentDidMount = async () => {
		await this.getInfo();
	}

	getInfo = () => {
		axios({
			url: "/api/v1/students/" + localStorage.getItem("id"),
            method: "GET",
		})
		.then( (res) => {
			this.setState({
				firstName: res.data.data.firstName,
				lastName: res.data.data.lastName,
				id: localStorage.getItem("id"),
				email: res.data.data.email
			});
		})
		.catch( () => {
			swal.fire({
                title: 'Oops !',
                text: "Unexpected error, Try Again",
                icon: 'error',
				background: "black",
				color: "white"
            });
		})
	}

    //Función que actualiza los states
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

	change = () => {
        if (document.getElementById("checkF").checked){
            document.getElementById("firstName").disabled=""
        }if (document.getElementById("check2").checked) {
            document.getElementById("lastName").disabled=""
        }if (document.getElementById("check3").checked){
            document.getElementById("email").disabled=""
        }if (!document.getElementById("checkF").checked){
            document.getElementById("firstName").disabled="disabled"
        }if (!document.getElementById("check2").checked) {
            document.getElementById("lastName").disabled="disabled"
        }if (!document.getElementById("check3").checked){
            document.getElementById("email").disabled="disabled"
        }
    }

	render() {
		return (
			<div className="EditProfile">
				<p id="title"> Your information</p>
				<form>
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
							<input id="checkF" type="checkbox" onChange={this.change}></input>
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
							<input id="check2" type="checkbox" onChange={this.change}></input>
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
							<input id="check3" type="checkbox" onChange={this.change}></input>
						</div>
					</div>
					<div>
                    <button
						onClick={this.password}
						className="btn btn-primary"
						style={{ marginTop: "20px", width: "200px", background: "black"}}
					>
						Change Password
					</button>
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
