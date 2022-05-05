const ErrorResponse = require("../utils/errorResponse");
const colors = require("../config/dependencies");

const getValue = (string, key) => {
	let value;
	let start = string.search(key);
	start = start + key.length + 2;
	value = string.substring(start);
	const end = value.indexOf('"');
	value = value.substring(0, end);
	return value;
};

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Mongoose bad ObjectId
	if (err.name == "CastError") {
		const model = getValue(err.toString(), "model");
		const key = getValue(err.toString(), "path");
		const message = `${model} not found with ${key}: ${err.value}.`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if (err.code == 11000) {
		const message = `Duplicate field value entered, Object is already registered.`;
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name == "ValidationError") {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 400);
	}

	console.log(`${err}`.red.bold);

	res.status(err.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
	});
};

module.exports = errorHandler;
