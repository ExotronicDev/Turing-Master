import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import roleChecker from "./roleChecker";

const StudentRoutes = (props) => {
	return roleChecker.isStudent() ? <Outlet /> : <Navigate to="/login" />;
};

export default StudentRoutes;
