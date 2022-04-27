import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import roleChecker from "./roleChecker";

const PublicRoutes = (props) => {
	const isStudent = roleChecker.isStudent();
	const isProfessor = roleChecker.isProfessor();

	if (isStudent) {
		return <Navigate to="/students/menu" />;
	} else if (isProfessor) {
		return <Navigate to="/professors/menu" />;
	} else {
		return <Outlet />;
	}
};

export default PublicRoutes;
