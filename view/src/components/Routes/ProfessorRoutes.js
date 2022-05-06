import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import roleChecker from "./roleChecker";

const ProfessorRoutes = (props) => {
	return roleChecker.isProfessor() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProfessorRoutes;
