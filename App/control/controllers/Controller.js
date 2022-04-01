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

//  @desc       Get current Logged-in Student
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
	const foundStudent = await control.getStudent({ id: req.params.id });
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
	if (!student.id) {
		student.id = req.params.id;
	}
	const control = new StudentController();
	const foundStudent = await control.getStudent({ id: req.params.id });
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	const updateResponse = await control.updateStudent(student);
	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`No changes were made to the Student with id: ${req.params.id}.`,
				304
			)
		);
	}
	res.json({ success: true, data: updateResponse });
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
	const deleteResponse = await control.deleteStudent(req.params.id);
	if (deleteResponse.deletedCount == 0 || !deleteResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`Could not delete the Student with id: ${req.params.id}.`,
				304
			)
		);
	}
	res.json({ success: true, data: deleteResponse });
});

//  @desc       Get Student TMachines
//  @route      GET /api/v1/students/:id/tmachines
//  @access     Private
exports.getStudentTMachines = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	if (req.user.id != req.params.id) {
		return next(
			new ErrorResponse(
				`Current user does not have access to the requested TMachines.`,
				401
			)
		);
	}
	const foundStudent = await control.getStudent({ id: req.params.id });
	if (foundStudent.length == 0) {
		return next(
			new ErrorResponse(
				`Student with id: ${req.params.id} does not exist.`,
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
	// Extensión: collaborators
	if (loggedStudent.id != requestedTMachine.owner.id) {
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

//  @desc       Create new TMachine
//  @route      POST /api/v1/tmachines
//  @access     Private
exports.createTMachine = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const foundStudents = await control.getStudent({ id: req.user.id });
	const student = foundStudents[0];
	const newTMachine = await control.createTMachine(
		student,
		req.body.description
	);
	res.json({ success: true, data: newTMachine });
});

//  @desc       Update TMachine
//  @route      PUT /api/v1/tmachines/:id
//  @access     Private
exports.updateTMachine = asyncHandler(async (req, res, next) => {
	const controlTMachine = new TMachineController();
	const foundTMachines = await controlTMachine.getTMachine(req.params.id);
	if (foundTMachines.length == 0) {
		return next(
			new ErrorResponse(
				`TMachine not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	const tMachine = req.body;
	if (!tMachine.id) {
		tMachine.id = req.params.id;
	}
	const controlStudent = new StudentController();
	const foundStudents = await controlStudent.getStudent({ id: req.user.id });
	const loggedStudent = foundStudents[0];
	const originalTMachine = foundTMachines[0];
	if (loggedStudent.id != originalTMachine.owner.id) {
		return next(
			new ErrorResponse(
				`Current user does not have permission to update the current TMachine with id: ${req.params.id}.`,
				401
			)
		);
	}

	const updateResponse = await controlTMachine.updateTMachine(
		req.params.id,
		tMachine
	);
	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`No changes were made to the TMachine with id: ${req.params.id}.`,
				304
			)
		);
	}
	res.json({ success: true, data: updateResponse });
});

//  @desc       Delete TMachine
//  @route      DELETE /api/v1/tmachines/:id
//  @access     Private
exports.deleteTMachine = asyncHandler(async (req, res, next) => {
	const controlTMachine = new TMachineController();
	const foundTMachines = await controlTMachine.getTMachine(req.params.id);
	if (foundTMachines.length == 0) {
		return next(
			new ErrorResponse(
				`TMachine not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	const controlStudent = new StudentController();
	const foundStudents = await controlStudent.getStudent({ id: req.user.id });
	const loggedStudent = foundStudents[0];
	const originalTMachine = foundTMachines[0];
	if (loggedStudent.id != originalTMachine.owner.id) {
		return next(
			new ErrorResponse(
				`Current user does not have permission to delete the current TMachine with id: ${req.params.id}.`,
				401
			)
		);
	}

	const deleteResponse = await controlTMachine.deleteTMachine(req.params.id);
	if (deleteResponse.deletedCount == 0 || !deleteResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`Could not delete the TMachine with id: ${req.params.id}.`,
				304
			)
		);
	}
	console.log(loggedStudent);
	const updateResponse = await controlStudent.deleteTMachine(
		loggedStudent,
		req.params.id
	);
	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`Error deleting the TMachine with id: ${req.params.id} from the current user.`,
				304
			)
		);
	}
	res.json({ success: true, data: updateResponse });
});

//-----------------States-----------------//
//	***			No Database interactions

//  @desc       Create TMachine State
//  @route      POST /api/v1/tmachines/states
//  @access     Public
exports.createState = (req, res, next) => {
	const { states, stateName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.createState(states, stateName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`State named "${stateName}" already exists in the current TMachine.`,
				304
			)
		);
	}
	res.json({ success: true, data: modifiedStates });
};

//  @desc       Update TMachine States
//  @route      PUT /api/v1/tmachines/states
//  @access     Public
exports.updateState = (req, res, next) => {
	const { states, oldName, newName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.updateState(states, oldName, newName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`Could not rename the state "${oldName}" to "${newName}".`,
				304
			)
		);
	}
	res.json({ success: true, data: modifiedStates });
};

//  @desc       Delete TMachine States
//  @route      DELETE /api/v1/tmachines/states
//  @access     Public
exports.deleteState = (req, res, next) => {
	const { states, stateName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.deleteState(states, stateName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`State named "${stateName}" does not exist in the current TMachine.`,
				304
			)
		);
	}
	res.json({ success: true, data: modifiedStates });
};
