const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("./../../utils/errorResponse");

const StudentController = require("./StudentController");
const TMachineController = require("./TMachineController");
const ProfessorController = require("./ProfessorController");

const CounterDao = require("../daos/CounterDao");

//-----------------General Authentication-----------------//

//  @desc       Logout Student and clear cookie
//  @route      POST /api/students/logout
//  @access     Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.json({ success: true, data: {} });
});

//  @desc       Get current Logged-in Student
//  @route      POST /api/students/me
//  @access     Private
exports.getMe = asyncHandler(async (req, res, next) => {
	//const controlStudent = new StudentController();
	let control;

	if (req.user.role === "students") {
		control = new StudentController();
		const student = await control.getStudent({ id: req.user.id });

		if (student.length == 0) {
			return next(new ErrorResponse(`Student doesn't exist.`, 404));
		}
		res.json({ success: true, role: "students", data: student[0] });
	} else if (req.user.role === "professors") {
		control = new ProfessorController();
		const professor = await control.getProfessor({ id: req.user.id });

		if (professor.length == 0) {
			return next(new ErrorResponse(`Professor doesn't exist.`, 404));
		}
		res.json({ success: true, role: "professors", data: professor[0] });
	} else {
		return next(
			new ErrorResponse(
				`Invalid token. Access has been denied to this route.`,
				401
			)
		);
	}
});

//-----------------Student Authentication-----------------//

//  @desc       Register new Student
//  @route      POST /api/students/register
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
				409
			)
		);
	}
	const savedStudent = await control.register(student);
	sendTokenResponse(savedStudent, 200, res);
});

//  @desc       Login Student
//  @route      POST /api/students/login
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

const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken();

	// Miliseconds -> seconds -> minutes -> hours -> days
	const days = process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24;
	const options = {
		expires: new Date(Date.now() + days),
	};

	if (process.env.NODE_ENV === "production") {
		// options.secure = true;
		// options.httpOnly = true;
	}

	res.cookie("token", token, options).json({
		success: true,
		token,
		data: user,
	});
};

//-----------------Professor Authentication-----------------//

// @desc		Register new Professor
// @route		POST /api/professors/register
// @access		Public
exports.registerProfessor = asyncHandler(async (req, res, next) => {
	const professor = req.body;
	const control = new ProfessorController();
	const filter = { $or: [{ email: req.body.email }, { id: req.body.id }] };
	const foundProfessor = await control.getProfessor(filter);
	if (foundProfessor.length != 0) {
		return next(
			new ErrorResponse(
				`Professor is already registered. Please login with the existing account or create a new one.`,
				409
			)
		);
	}
	const savedProfessor = await control.register(professor);
	sendTokenResponse(savedProfessor, 200, res);
});

// @desc		Login Professor
// @route		POST /api/professors/login
// @access		Public
exports.loginProfessor = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new ErrorResponse(`Please provide an email and password.`, 400)
		);
	}
	const control = new ProfessorController();
	const loggedProfessor = await control.login(email, password);
	if (!loggedProfessor) {
		return next(new ErrorResponse(`Invalid credentials.`, 401));
	}
	sendTokenResponse(loggedProfessor, 200, res);
});

//-----------------Professor---------------//

// @desc		Get all Professors
// @route		GET /api/professors
// @access		Public
exports.getProfessors = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	control.getProfessors().then((data) => {
		res.json({ success: true, count: data.length, data });
	});
});

// @desc		Get single Professor
// @route		GET /api/professors/:id
// @access		Public
exports.getProfessor = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const foundProfessor = await control.getProfessor({ id: req.params.id });
	if (foundProfessor.length == 0) {
		return next(
			new ErrorResponse(
				`Professor not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	res.json({ success: true, data: foundProfessor[0] });
});

//  @desc       Update Professor
//  @route      PUT /api/professors/:id
//  @access     Private
exports.updateProfessor = asyncHandler(async (req, res, next) => {
	const professorChanges = req.body;
	if (!professorChanges.id) {
		professorChanges.id = req.params.id;
	}
	const control = new ProfessorController();
	const foundProfessor = await control.getProfessor({ id: req.params.id });
	if (foundProfessor.length == 0) {
		return next(
			new ErrorResponse(
				`Professor not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	const updateResponse = await control.updateProfessor(
		professorChanges.id,
		professorChanges
	);
	if (updateResponse == -1) {
		return next(
			new ErrorResponse(
				`To change password, introduce the original and new password.`,
				403
			)
		);
	} else if (updateResponse == -2) {
		return next(
			new ErrorResponse(
				`Original password introduced does not match with the stored password. Cannot update Professor.`,
				403
			)
		);
	} else if (updateResponse.passwordChanged) {
		res.json({ success: true, data: updateResponse });
	} else if (
		updateResponse.modifiedCount == 0 ||
		!updateResponse.acknowledged
	) {
		return next(
			new ErrorResponse(
				`No changes were made to the Professor with id: ${req.params.id}.`,
				304
			)
		);
	}
	res.json({ success: true, data: updateResponse });
});

//-----------------Student-----------------//

//  @desc       Get all Students
//  @route      GET /api/students
//  @access     Public
exports.getStudents = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	control.getStudents().then((data) => {
		res.json({ success: true, count: data.length, data });
	});
});

//  @desc       Get single Student
//  @route      GET /api/students/:id
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
//  @route      PUT /api/students/:id
//  @access     Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
	const studentChanges = req.body;
	if (!studentChanges.id) {
		studentChanges.id = req.params.id;
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
	const updateResponse = await control.updateStudent(
		studentChanges.id,
		studentChanges
	);
	if (updateResponse == -1) {
		return next(
			new ErrorResponse(
				`To change password, introduce the original and new password.`,
				403
			)
		);
	} else if (updateResponse == -2) {
		return next(
			new ErrorResponse(
				`Original password introduced does not match with the stored password. Cannot update Student.`,
				403
			)
		);
	} else if (updateResponse.passwordChanged) {
		res.json({ success: true, data: updateResponse });
	} else if (
		updateResponse.modifiedCount == 0 ||
		!updateResponse.acknowledged
	) {
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
//  @route      DELETE /api/students/:id
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
				409
			)
		);
	}
	res.json({ success: true, data: deleteResponse });
});

//  @desc       Get Student TMachines
//  @route      GET /api/students/:id/tmachines
//  @access     Private
exports.getStudentTMachines = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	if (req.user.id != req.params.id) {
		return next(
			new ErrorResponse(
				`Current user does not have access to the requested TMachines.`,
				403
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

//  @desc       Get Student Courses
//  @route      GET /api/students/:id/courses
//  @access     Private
exports.getStudentCourses = asyncHandler(async (req, res, next) => {
	const control = new StudentController();
	const idStudent = req.params.id;
	const foundCourses = await control.getCourses(idStudent);

	if (foundCourses == -1) {
		return next(new ErrorResponse(`Student does not exist.`, 404));
	}

	res.json({ success: true, length: foundCourses.length, data: foundCourses });
});

//-----------------Counter-----------------//

exports.getCounter = asyncHandler(async (req, res, next) => {
	const dao = new CounterDao();
	const result = await dao.getAll();

	res.json({ success: true, data: result });
});

//-----------------TMachines-----------------//

//  @desc       Get all TMachines
//  @route      GET /api/tmachines
//  @access     Public
exports.getTMachines = asyncHandler(async (req, res, next) => {
	const control = new TMachineController();
	control.getTMachines().then((data) => {
		res.json({ success: true, count: data.length, data });
	});
});

//  @desc       Get single TMachine
//  @route      GET /api/tmachines/:id
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
				403
			)
		);
	}
	res.json({
		success: true,
		data: requestedTMachine,
	});
});

//  @desc       Create new TMachine
//  @route      POST /api/tmachines
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
//  @route      PUT /api/tmachines/:id
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
				403
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
	if (tMachine.description) {
		const updateResponseStudent = await controlStudent.updateTMachine(
			loggedStudent,
			tMachine
		);
		if (
			updateResponseStudent.modifiedCount == 0 ||
			!updateResponseStudent.acknowledged
		) {
			return next(
				new ErrorResponse(
					`Error updating the TMachine with id: ${req.params.id} from the current user.`,
					409
				)
			);
		}
		res.json({ success: true, data: updateResponseStudent });
	}
	res.json({ success: true, data: updateResponse });
});

//  @desc       Delete TMachine
//  @route      DELETE /api/tmachines/:id
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
				403
			)
		);
	}

	const deleteResponse = await controlTMachine.deleteTMachine(req.params.id);
	if (deleteResponse.deletedCount == 0 || !deleteResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`Could not delete the TMachine with id: ${req.params.id}.`,
				409
			)
		);
	}
	const updateResponse = await controlStudent.deleteTMachine(
		loggedStudent,
		req.params.id
	);
	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`Error deleting the TMachine with id: ${req.params.id} from the current user.`,
				409
			)
		);
	}
	res.json({ success: true, data: updateResponse });
});

//-----------------States-----------------//
//	***			No Database interactions

//  @desc       Create TMachine State
//  @route      POST /api/tmachines/states
//  @access     Public
exports.createState = (req, res, next) => {
	const { states, stateName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.createState(states, stateName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`State named "${stateName}" already exists in the current TMachine.`,
				409
			)
		);
	}
	res.json({ success: true, states: modifiedStates });
};

//  @desc       Update TMachine States
//  @route      PUT /api/tmachines/states
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
	res.json({ success: true, states: modifiedStates });
};

//  @desc       Set TMachine State as Initial State
//  @route      PUT /api/tmachines/states/initial
//  @access     Public
exports.setInitialState = (req, res, next) => {
	const { states, stateName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.setInitialState(states, stateName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`State named "${stateName}" does not exist in the current TMachine.`,
				404
			)
		);
	}
	res.json({ success: true, states: modifiedStates });
};

//  @desc       Delete TMachine States
//  @route      DELETE /api/tmachines/states
//  @access     Public
exports.deleteState = (req, res, next) => {
	const { states, stateName } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.deleteState(states, stateName);
	if (!modifiedStates) {
		return next(
			new ErrorResponse(
				`State named "${stateName}" does not exist in the current TMachine.`,
				404
			)
		);
	}
	res.json({ success: true, states: modifiedStates });
};

//-----------------Transitions-----------------//
//	***			No Database interactions

//  @desc       Create State Transition
//  @route      POST /api/tmachines/states/transitions
//  @access     Public
exports.createTransition = (req, res, next) => {
	const { states, transition } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.createTransition(states, transition);
	if (!modifiedStates) {
		return next(new ErrorResponse(`Could not create transition.`, 409));
	}
	res.json({ success: true, states: modifiedStates });
};

//  @desc       Update State Transition
//  @route      PUT /api/tmachines/states/transitions
//  @access     Public
exports.updateTransition = (req, res, next) => {
	const { states, oldTransition, newTransition } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.deleteTransition(states, oldTransition);
	if (!modifiedStates) {
		return next(new ErrorResponse(`Could not delete old transition.`, 409));
	}
	const finalStates = control.createTransition(states, newTransition);
	if (!finalStates) {
		return next(new ErrorResponse(`Could not create new transition.`, 409));
	}
	res.json({ success: true, states: finalStates });
};

//  @desc       Delete State Transition
//  @route      DELETE /api/tmachines/states/transitions
//  @access     Public
exports.deleteTransition = (req, res, next) => {
	const { states, transition } = req.body;
	const control = new TMachineController();
	const modifiedStates = control.deleteTransition(states, transition);
	if (!modifiedStates) {
		return next(new ErrorResponse(`Could not delete transition.`, 409));
	}
	res.json({ success: true, states: modifiedStates });
};

// @desc		Simulate TMachine
// @route		POST /api/tmachines/simulate
// @access		Public
exports.simulateTMachine = (req, res, next) => {
	const { tMachine, input, blank } = req.body;
	const control = new TMachineController();
	const output = control.simulate(tMachine, input, blank);
	if (output == -2) {
		return next(
			new ErrorResponse(`TMachine has no states to simulate`, 412)
		);
	} else if (output == -1) {
		return next(new ErrorResponse(`TMachine has no initial state`, 412));
	} else if (output.status === "failed") {
		res.json({ success: false, data: output });
	}
	res.json({ sucess: true, data: output });
};

//-----------------Course-----------------//

// @desc		Create Course
// @route		POST /api/courses/createCourse
// @access		Private
exports.createCourse = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const course = req.body;
	const idProfessor = req.user.id;
	console.log(course);
	const newCourse = await control.createCourse(course, idProfessor);

	res.json({ success: true, data: newCourse });
});

// @desc		Get Course
// @route		GET /api/courses/:code
// @access		Private
exports.getCourse = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const courseCode = req.params.code;
	const queryResult = await control.getCourse(courseCode);

	if (queryResult == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	}
	res.json({ success: true, data: queryResult });
});

// @desc		Get Courses
// @route		GET /api/professors/:id/courses/
// @access		Private
exports.getCourses = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const idProfessor = req.user.id;
	const queryResult = await control.getCourses(idProfessor);

	if (queryResult == -1) {
		return next(new ErrorResponse(`Professor does not exist.`, 404));
	}
	res.json({ success: true, length: queryResult.length, data: queryResult });
});

// @desc		Update Course
// @route		POST /api/courses/:code/update
// @access		Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const courseCode = req.params.code;
	const foundCourse = await control.getCourse(courseCode);

	if (foundCourse == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	}

	const courseChanges = req.body;
	const updateResponse = await control.updateCourse(
		courseCode,
		courseChanges
	);
	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(
			new ErrorResponse(
				`No changes were made to the Course with code: ${courseCode}`,
				304
			)
		);
	}

	res.json({ success: true, data: updateResponse });
});

// @desc		Get Course Students
// @route		GET /api/courses/:code/students
// @access		Private
exports.getCourseStudents = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();
	const courseCode = req.params.code;
	const foundStudents = await control.getStudents(courseCode);

	if (foundStudents == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	}

	res.json({
		success: true,
		length: foundStudents.length,
		data: foundStudents,
	});
});

// @desc		Enroll Student in Course
// @route		POST /api/courses/:code/students
// @access		Private
exports.enrollStudent = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const idStudent = req.body.idStudent;

	const enrollResponse = await control.enrollStudent(idStudent, courseCode);

	if (enrollResponse == -1) {
		return next(new ErrorResponse(`Student does not exist.`, 404));
	} else if (enrollResponse == -2) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	}

	res.json({ success: true, data: enrollResponse });
});

// @desc		Clone Course
// @route		POST /api/courses/:code/clone
// @access		Private
exports.cloneCourse = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const newCourseCode = req.body;

	const cloneResponse = await control.cloneCourse(courseCode, newCourseCode);

	if (cloneResponse == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	} else if (cloneResponse == -2) {
		return next(new ErrorResponse(`New code for cloned course already exists.`, 409));
	}

	res.json({ success: true, data: cloneResponse });
});

//------------------------Exercises-----------------------//
// @desc		Add Exercise
// @route		POST /api/courses/:code/exercises/
// @access		Private
exports.addExercise = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exercise = req.body;

	/* Exercise debería tener esto
	Exercise = {
		name:
		description:
		inputDescription:
		outputDescription:
	}
	*/
	const newExercise = await control.createExercise(courseCode, exercise);

	res.json({ success: true, data: newExercise });
});

// @desc		Update Exercise
// @route		PUT /api/courses/:code/exercises/:slug
// @access		Private
exports.updateExercise = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const exerciseChanges = req.body;

	/* ExerciseChanges debería de tener esto
	exerciseChanges = {
		description:
		inputDescription:
		outputDescription:
	}
	*/
	const updateResponse = await control.updateExercise(exerciseSlug, courseCode, exerciseChanges);

	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(new ErrorResponse(`Exercise could not be updated. No changes were made to the Exercise.`, 304));
	}

	res.json({ success: true, data: updateResponse });
});

// @desc		Save Exercise Arrays
// @route		POST /api/courses/:code/exercises/:slug
// @access		Private
exports.saveExerciseArrays = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const exerciseChanges = req.body;

	/* ExerciseChanges debería de tener esto
	exerciseChanges = {
		exampleCases:
		testCases:
	}
	*/
	const updateResponse = await control.updateExercise(exerciseSlug, courseCode, exerciseChanges);

	if (updateResponse.modifiedCount == 0 || !updateResponse.acknowledged) {
		return next(new ErrorResponse(`Exercise could not be updated. No changes were made to the Exercise.`, 304));
	}

	res.json({ success: true, data: updateResponse });
});

// @desc		Get Exercise
// @route		GET /api/courses/:code/exercises/:slug
// @access		Private
exports.getExercise = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const storedExercise = await control.getExercise(courseCode, exerciseSlug);

	if (storedExercise == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	} else if (storedExercise == -2) {
		return next(new ErrorResponse(`Exercise does not exist.`, 404));
	}

	res.json({ success: true, data: storedExercise });
});

// @desc		Get Exercises
// @route		GET /api/courses/:code/exercises/
// @access		Private
exports.getExercises = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;

	const storedExercises = await control.getExercises(courseCode);

	if (storedExercises == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	}

	res.json({ success: true, length: storedExercises.length, data: storedExercises });
});

// @desc		Delete Exercise
// @route		DELETE /api/courses/:code/exercises/:slug
// @access		Private
exports.deleteExercise = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const deleteResponse = await control.deleteExercise(courseCode, exerciseSlug);

	if (deleteResponse == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	} else if (deleteResponse == -2) {
		return next(new ErrorResponse(`Exercise does not exist.`, 404));
	}

	res.json({ success: true, data: deleteResponse });
});

//------------------------Test/Example Cases-----------------------//
// @desc		Get Exercise Test Cases
// @route		GET /api/courses/:code/exercises/:slug/tests
// @access		Private
exports.getTestCases = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const testCases = await control.getTestCases(courseCode, exerciseSlug);

	if (testCases == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	} else if (testCases == -2) {
		return next(new ErrorResponse(`Exercise does not exist.`, 404));
	}

	return res.json({ success: true, length: testCases.length, data: testCases });
});

// @desc		Create Exercise Test Case
// @route		POST /api/courses/:code/exercises/:slug/tests
// @access		Private
exports.createTestCase = (req, res, next) => {
	const control = new ProfessorController();
	const { testCases, newTestCase } = req.body;
	const modifiedTestCases = control.createTestCase(testCases, newTestCase);

	if (modifiedTestCases == -1) {
		return next(new ErrorResponse(`Test Case "${newTestCase.number}" already exists.`, 409));
	}

	res.json({ success: true, testCases: modifiedTestCases });
};

// @desc		Update Exercise Test Case
// @route		PUT /api/courses/:code/exercises/:slug/tests
// @access		Private
exports.updateTestCase = (req, res, next) => {
	const control = new ProfessorController();
	const { testCases, modifiedTestCase } = req.body;
	const modifiedTestCases = control.updateTestCase(testCases, modifiedTestCase);

	if (modifiedTestCases == -1) {
		return next(new ErrorResponse(`Could not modify test case "${modifiedTestCase.number}"`, 309));
	}

	res.json({ success: true, testCases: modifiedTestCases });
};

// @desc		Delete Exercise Test Case
// @route		DELETE /api/courses/:code/exercises/:slug/tests
// @access		Private
exports.deleteTestCase = (req, res, next) => {
	const control = new ProfessorController();
	const { testCases, deletedTestCase } = req.body;
	const modifiedTestCases = control.deleteTestCase(testCases, deletedTestCase);

	if (modifiedTestCases == -1) {
		return next(new ErrorResponse(`Test Case "${deletedTestCase.number}" does not exist.`, 404));
	}

	res.json({ success: true, testCases: modifiedTestCases });
};

// @desc		Get Exercise Example Cases
// @route		GET /api/courses/:code/exercises/:slug/examples
// @access		Private
exports.getExampleCases = asyncHandler(async (req, res, next) => {
	const control = new ProfessorController();

	const courseCode = req.params.code;
	const exerciseSlug = req.params.slug;

	const exampleCases = await control.getTestCases(courseCode, exerciseSlug);

	if (exampleCases == -1) {
		return next(new ErrorResponse(`Course does not exist.`, 404));
	} else if (exampleCases == -2) {
		return next(new ErrorResponse(`Exercise does not exist.`, 404));
	}

	return res.json({ success: true, length: exampleCases.length, data: exampleCases });
});

// @desc		Create Exercise Example Case
// @route		POST /api/courses/:code/exercises/:slug/examples
// @access		Private
exports.createExampleCase = (req, res, next) => {
	const control = new ProfessorController();
	const { exampleCases, newExampleCase } = req.body;
	const modifiedExampleCases = control.createTestCase(exampleCases, newExampleCase);

	if (modifiedExampleCases == -1) {
		return next(new ErrorResponse(`Test Case "${newExampleCase.number}" already exists.`, 409));
	}

	res.json({ success: true, testCases: modifiedExampleCases });
};

// @desc		Update Exercise Example Case
// @route		PUT /api/courses/:code/exercises/:slug/examples
// @access		Private
exports.updateExampleCase = (req, res, next) => {
	const control = new ProfessorController();
	const { exampleCases, modifiedExampleCase } = req.body;
	const modifiedExampleCases = control.updateTestCase(exampleCases, modifiedExampleCase);

	if (modifiedExampleCases == -1) {
		return next(new ErrorResponse(`Could not modify test case "${modifiedExampleCase.number}"`, 309));
	}

	res.json({ success: true, testCases: modifiedExampleCases });
};

// @desc		Delete Exercise Example Case
// @route		DELETE /api/courses/:code/exercises/:slug/examples
// @access		Private
exports.deleteExampleCase = (req, res, next) => {
	const control = new ProfessorController();
	const { exampleCases, deletedExampleCase } = req.body;
	const modifiedExampleCases = control.deleteTestCase(exampleCases, deletedExampleCase);

	if (modifiedExampleCases == -1) {
		return next(new ErrorResponse(`Test Case "${deletedExampleCase.number}" does not exist.`, 404));
	}

	res.json({ success: true, testCases: modifiedExampleCases });
};