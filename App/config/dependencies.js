// General
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = {
	express,
	morgan,
	path,
	dotenv,
	mongoose,
	colors,
	slugify,
	bcrypt,
	jwt,
	cookieParser,
};
