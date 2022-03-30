// General
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
	express,
	morgan,
	path,
	dotenv,
	mongoose,
	colors,
	bcrypt,
	jwt,
};
