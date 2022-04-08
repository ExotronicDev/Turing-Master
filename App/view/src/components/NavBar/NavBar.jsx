import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import { Cookies } from "../../dependencies";
import "./NavBar.css";

function NavBar() {
	// state = {
	// 	clicked: false,
	// 	setClick: false,
	// 	show: false,
	// };
	const [clicked, setClick] = useState(false);

	const handleClick = () => setClick(!clicked);

	const token = Cookies.get("token");
	console.log(token === undefined);
	// if (token === undefined) {
	//     console.log("AAAAAAAA");
	//     this.setState({ show: false });
	// } else {
	//     this.setState({ show: true });
	// }

	// handleClick = () => this.setState.setClick = !this.state.clicked;

	return (
		<nav className="Navbar">
			<h1 className="navbarLogo">Turing Master</h1>
			<div className="menuIcon" onClick={handleClick}></div>
			<ul className="navMenu">
				<li className="navItem" key="1">
					Logout
				</li>
				{/* {token === undefined ? (
					MenuItems.map((item, index) => {
						return (
							<li className="navItem" key={index}>
								<Link
									href={item.url}
									className={item.cName}
									onClick={handleClick}
								>
									{item.title}
								</Link>
							</li>
						);
					})
				) : (
					<li className="navItem" key="1">
						<Link
							className="navLinks"
							onClick={() => (window.location = "/")}
						>
							Logout
						</Link>
					</li>
				)} */}
			</ul>
		</nav>
	);
}

export default NavBar;
