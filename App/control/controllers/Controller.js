const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("./../../utils/errorResponse");
const StudentController = require("./StudentController");
const CounterDao = require("../daos/CounterDao");
const TMachineController = require("./TMachineController");

//-----------------Authentication-----------------//

//  @desc       Register new Student
//  @route      POST /api/v1/students/register
//  @access     Public
exports.registerStudent = asyncHandler(async (req, res, next) => {
	const student = req.body;
	const control = new StudentController();
	const filter = { $or: [{ email: req.body.email }, { id: req.body.id }] };
	const foundStudent = await control.getStudent(filter);
	if (foundStudent.length != 0) {
		return next(
			new ErrorResponse(
				`Student is alreday registered. Please login with the existing account or create a new one.`,
				500
			)
		);
	}
	const savedStudent = await control.register(student);
	sendTokenResponse(savedStudent, 200, res);
});

//  @desc       Login Student
//  @route      POST /api/v1/students/login
//  @access     Public
exports.loginStudent = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new ErrorResponse(`Please provide an email and password.`, 400)
		);
	}
	const control = new StudentController();
	const loggedStudent = await control.login(email, password);
	if (!loggedStudent) {
		return next(new ErrorResponse(`Invalid credentials.`, 401));
	}
	sendTokenResponse(loggedStudent, 200, res);
});

//  @desc       Logout Student and clear cookie
//  @route      POST /api/v1/students/logout
//  @access     Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.json({ success: true, data: {} });
});

//  @desc       Login Student
//  @route      POST /api/v1/students/me
//  @access     Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const student = await control.getStudent({ id: req.user.id });

	res.json({ success: true, data: student[0] });
});

const sendTokenResponse = (student, statusCode, res) => {
	// Create token
	const token = student.getSignedJwtToken();

	// Miliseconds -> seconds -> minutes -> hours -> days
	const days = process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24;
	const options = {
		expires: new Date(Date.now() + days),
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
		options.httpOnly = true;
	}

	res.cookie("token", token, options).json({
		success: true,
		token,
		data: student,
	});
};

//-----------------Student-----------------//

//  @desc       Get all Students
//  @route      GET /api/v1/students
//  @access     Public
exports.getStudents = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	control.getStudents().then((data) => {
		res.json({ success: true, count: data.length, data });
	});
});

//  @desc       Get single Student
//  @route      GET /api/v1/students/:id
//  @access     Public
exports.getStudent = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const filter = { id: req.params.id };
	const foundStudent = await control.getStudent(filter);
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	res.json({ success: true, data: foundStudent[0] });
});

//  @desc       Update Student
//  @route      PUT /api/v1/students/:id
//  @access     Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
	const student = req.body;
	const control = new StudentController();
	const filter = { id: req.params.id };
	const foundStudent = await control.getStudent(filter);
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student not found with id: ${req.params.id}.`,
				404
			)
		);
	}

	const updatedStudent = await control.updateStudent(student);
	res.json({ success: true, data: updatedStudent });
});

//  @desc       Delete Student
//  @route      DELETE /api/v1/students/:id
//  @access     Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const filter = { id: req.params.id };
	const foundStudent = await control.getStudent(filter);
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	const deletedStudent = await control.deleteStudent(req.params.id);
	res.json({ success: true, data: deletedStudent });
});

//	HACE FALTA VERIFICAR OWNER
//  @desc       Get Student TMachines
//  @route      GET /api/v1/students/:idStudent/tmachines
//  @access     Private
exports.getStudentTMachines = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const foundStudent = await control.getStudent({ id: req.params.idStudent });
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student with id: ${req.params.idStudent} does not exist.`,
				404
			)
		);
	}

	const foundTMachines = await control.getTMachines(foundStudent[0]);
	res.json({
		success: true,
		count: foundTMachines.length,
		data: foundTMachines,
	});
});

//-----------------Counter-----------------//

exports.getCounter = asyncHandler(async (req, res, next) => {
	const dao = new CounterDao();
	const result = await dao.getAll();

	res.json({ success: true, data: result });
});

//-----------------TMachines-----------------//

//  @desc       Get all TMachines
//  @route      GET /api/v1/tmachines
//  @access     Public
exports.getTMachines = asyncHandler(async (req, res, next) => {
	const control = new TMachineController();
	control.getTMachines().then((data) => {
		res.json({ success: true, count: data.length, data });
	});
});

//  @desc       Get single TMachine
//  @route      GET /api/v1/tmachines/:id
//  @access     Private
exports.getTMachine = asyncHandler(async (req, res, next) => {
	const controlStudent = new StudentController();
	const controlTMachine = new TMachineController();
	const foundStudents = await controlStudent.getStudent({ id: req.user.id });
	if (foundStudents.length == 0) {
		return next(
			new ErrorResponse(
				`Student (logged in?) with id: ${req.params.idStudent} does not exist.`,
				404
			)
		);
	}
	const foundTMachines = await controlTMachine.getTMachine(req.params.id);
	if (foundTMachines.length == 0) {
		return next(
			new ErrorResponse(
				`TMachine not found with id: ${req.params.id}.`,
				404
			)
		);
	}

	const loggedStudent = foundStudents[0];
	const requestedTMachine = foundTMachines[0];
	if (loggedStudent.id !== requestedTMachine.owner.id) {
		return next(
			new ErrorResponse(
				`Current user does not have access to the requested TMachine with id: ${req.params.id}.`,
				401
			)
		);
	}

	res.json({
		success: true,
		data: requestedTMachine,
	});
});

// 	No funcional
//  @desc       Create new TMachine
//  @route      POST /api/v1/tmachines
//  @access     Private
exports.createTMachine = asyncHandler(async (req, res, next) => {
	// const object = req.body;
	// Add student to req.body
	req.body.user = req.user.id;
	const control = new TMachineController();
	const filter = { id: req.body.id };
	const foundTMachine = await control.getStudent(filter);

	if (foundTMachine.length != 0) {
		return next(
			new ErrorResponse(
				`TMachine alreday registered with id: ${req.body.id}.`,
				500
			)
		);
	}

	const savedUser = await control.createTMachine(object);
	res.json({ success: true, data: savedUser });
});

//  @desc       Create new Student TMachine
//  @route      POST /api/v1/students/:idStudent/tmachines
//  @access     Private
exports.createStudentTMachine = asyncHandler(async (req, res, next) => {
	const description = req.body.description;
	const control = new StudentController();
	const foundStudent = await control.getStudent({ id: req.params.idStudent });
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student with id: ${req.params.idStudent} does not exist.`,
				404
			)
		);
	}

	const savedTMachine = await control.createTMachine(
		foundStudent[0],
		description
	);
	res.json({ success: true, data: savedTMachine });
});

//  @desc       Update TMachine
//  @route      PUT /api/v1/tmachines/:id
//  @access     Private
exports.updateTMachine = asyncHandler(async (req, res, next) => {
	const object = req.body;
	const control = new StudentController();
	const filter = { id: req.body.id };
	const foundUser = await control.getStudent(filter);
	if (!foundUser) {
		return next(
			new ErrorResponse(`Student not found with id: ${req.body.id}.`, 404)
		);
	}

	const updatedUser = await control.updateTMachine(object);
	res.json({ success: true, data: updatedUser });
});

//  @desc       Delete TMachine
//  @route      DELETE /api/v1/tmachines/:id
//  @access     Private
exports.deleteTMachine = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const filter = { id: req.body.id };
	const foundUser = await control.getStudent(filter);
	if (!foundUser) {
		return next(
			new ErrorResponse(`Student not found with id: ${req.body.id}.`, 404)
		);
	}
	const deletedUser = await control.deleteTMachine(filter);
	res.json({ success: true, data: deletedUser });
});

//-----------------Student TMachines-----------------//

// Voy aca
//  @desc       Update Student TMachine
//  @route      PUT /api/v1/students/:idStudent/tmachines/:idTMachine
//  @access     Private
exports.updateStudentTMachine = asyncHandler(async (req, res, next) => {
	const object = req.body;
	const control = new StudentController();
	const filter = { id: req.body.id };
	const foundUser = await control.getStudent(filter);
	if (!foundUser) {
		return next(
			new ErrorResponse(`Student not found with id: ${req.body.id}.`, 404)
		);
	}

	const updatedUser = await control.updateTMachine(object);
	res.json({ success: true, data: updatedUser });
});

// Voy aca
//  @desc       Delete Student TMachine
//  @route      DELETE /api/v1/students/:idStudent/tmachines/:idTMachine
//  @access     Private
exports.deleteStudentTMachine = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const filter = { id: req.body.id };
	const foundUser = await control.getStudent(filter);
	if (!foundUser) {
		return next(
			new ErrorResponse(`Student not found with id: ${req.body.id}.`, 404)
		);
	}
	const deletedUser = await control.deleteTMachine(filter);
	res.json({ success: true, data: deletedUser });
});
