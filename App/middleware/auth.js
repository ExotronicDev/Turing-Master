const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const StudentController = require("../control/controllers/StudentController");
const { jwt } = require("../config/dependencies");

exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse("Access has been denied to this route."));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const control = new StudentController();
		req.student = await control.getStudent({ id: decoded.id });
		next();
	} catch (err) {
		return next(new ErrorResponse("Access has been denied to this route."));
	}
});

// middleware.isAuthenticated = (req, res, next) => {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	req.session.returnTo = req.originalUrl;
// 	res.redirect("/login");
// };

// module.exports = middleware;
