import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import roleChecker from "./roleChecker";

// const StudentRoute = ({ path, element: Element, render, ...rest }) => {
// 	return (
// 		<Route
// 			path={path}
// 			{...rest}
// 			render={(props) => {
// 				if (roleChecker.isStudent()) {
// 					return Element ? <Element {...props} /> : render(props);
// 				} else {
// 					return <Navigate to="/login" />;
// 				}
// 			}}
// 		/>
// 	);
// };

// export default StudentRoute;

const StudentRoutes = (props) => {
	return roleChecker.isStudent() ? <Outlet /> : <Navigate to="/login" />;
};

export default StudentRoutes;
