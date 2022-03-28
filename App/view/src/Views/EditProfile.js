import React, { Component } from "react";
import { Link } from "react-router-dom";

class EditProfile extends Component {

    //Función que actualiza los states
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

	render() {
		return (
			<div className="Register">
				<p id="title"> Your information</p>
				<form >
					<div className="form-group">
						<label for="firstName">First Name</label>
						<input
							type="text"
							className="form-control"
							id="firstName"
							placeholder="First Name"
							name="firstName"
							onChange={this.handleChange}
						/>
					</div>

					<div className="form-group">
						<label for="lastName">Last Name</label>
						<input
							type="text"
							className="form-control"
							id="lastName"
							placeholder="Last Name"
							name="lastName"
							onChange={this.handleChange}
						/>
					</div>
					
					<div className="form-group">
						<label for="id">ID</label>
						<input
							type="text"
							className="form-control"
							id="id"
							placeholder="Student ID"
							name="id"
							onChange={this.handleChange}
						/>
					</div>

					<div className="form-group">
						<label for="email">Email</label>
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="email@example.com"
							name="email"
							onChange={this.handleChange}
						/>
                        <i class="bi bi-pencil-square"></i>
					</div>
                    <div className="col-6">
                        <div className="forgot-password text-end">
                            <Link to="/forgot-password">Change password</Link>
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
