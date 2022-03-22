const ErrorResponse = require("../utils/errorResponse");
const colors = require("../config/dependencies");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Object not found with ObjectId of: ${err.value}.`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered.`;
        error = new ErrorResponse(message, 400);
    }
    
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    console.log(err);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Server Error"
    });
}

module.exports = errorHandler;