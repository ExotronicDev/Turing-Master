// General
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");

// Middleware for schemas
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

// Tokens and cookies
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Security
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

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
	mongoSanitize,
	helmet,
	xss,
	rateLimit,
	hpp,
	cors,
};
