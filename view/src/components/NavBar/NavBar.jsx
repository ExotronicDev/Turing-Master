import React from "react";
import { axios, swal } from "../../dependencies";
import "./NavBar.css";

function NavBar() {
	const menu = () => {
		axios({
			url: "/api/auth/me",
			method: "GET",
		})
			.then((res) => {
				if (res.data.success) {
					window.location = "/" + res.data.role + "/menu";
				} else {
					swal.fire({
						title: "Error!",
						text: res.data.error,
						icon: "warning",
						background: "black",
						color: "white",
					});
				}
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err.response.data.error,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	const profile = () => {
		window.location = "/profile";
	};

	const logout = () => {
		axios({
			url: "/api/auth/logout",
			method: "GET",
		})
			.then((res) => {
				if (res.data.success) {
					window.location = "/";
				} else {
					swal.fire({
						title: "Error!",
						text: res.data.error,
						icon: "warning",
						background: "black",
						color: "white",
					});
				}
			})
			.catch((err) => {
				swal.fire({
					title: "Error!",
					text: err.response.data.error,
					icon: "warning",
					background: "black",
					color: "white",
				});
			});
	};

	return (
		<nav className="Navbar">
			<div className="navbar-logo" onClick={menu}>
				Turing Master
			</div>
			<div id="background"></div>
			<ul className="navMenu">
				<li className="nav-item" key="1">
					<button
						className="nav-link"
						aria-details="Profile details"
						onClick={profile}
					>
						Profile
					</button>
				</li>
				<li className="nav-item" key="2">
					<button
						className="nav-link"
						aria-details="Logout your account"
						onClick={logout}
					>
						Logout
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default NavBar;
