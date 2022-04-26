const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const StudentController = require("../control/controllers/StudentController");
const ProfessorController = require("../control/controllers/ProfessorController");

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
		return next(
			new ErrorResponse("Access has been denied to this route.", 401)
		);
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const control = new StudentController();
		const userQuery = await control.getStudent({ id: decoded.id });
		if (userQuery.length == 0) {
			const controlProfessor = new ProfessorController();
			const professor = await controlProfessor.getProfessor({
				id: req.user.id,
			});
			if (professor.length == 0) {
				return next(new ErrorResponse(`User not logged in.`, 401));
			} else {
				req.user = professor[0];
				next();
			}
		}
		req.user = userQuery[0];
		next();
	} catch (err) {
		return next(
			new ErrorResponse("Access has been denied to this route.", 401)
		);
	}
});
