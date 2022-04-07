// React components
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
} from "react-router-dom";

// Dependencies
import axios from "axios";
import Cookies from "js-cookie";
import swal from "sweetalert2";

// SideBar components
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem,
} from "cdbreact";

// Testing components
import { render, screen } from "@testing-library/react";

export {
	React,
	Component,
	ReactDOM,
	Router,
	Routes,
	Route,
	NavLink,
	axios,
	Cookies,
	swal,
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem,
	render,
	screen,
};
