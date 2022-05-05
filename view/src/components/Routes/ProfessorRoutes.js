import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import roleChecker from "./roleChecker";

// export const ProfessorRoute = ({
// 	path,
// 	component: Component,
// 	render,
// 	...rest
// }) => {
// 	return (
// 		<Route
// 			path={path}
// 			{...rest}
// 			render={(props) => {
// 				if (roleChecker.isProfessor()) {
// 					return Component ? <Component {...props} /> : render(props);
// 				} else {
// 					return <Navigate to="/login" />;
// 				}
// 			}}
// 		/>
// 	);
// };

// export default ProfessorRoute;

const ProfessorRoutes = (props) => {
	return roleChecker.isProfessor() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProfessorRoutes;
