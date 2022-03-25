const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("./../../utils/errorResponse");
const StudentController = require("./StudentController");
const CounterDao = require("../daos/CounterDao");
const TMachineController = require("./TMachineController");

//-----------------Student-----------------//

//  @desc       Get all Students
//  @route      GET / api/v1/students
//  @access     Public
exports.getStudents = asyncHandler((req, res, next) => {
	const control = new StudentController();
	control.getStudents().then((data) => {
		res.json({ success: true, data: data });
	});
});

//  @desc       Get single Student
//  @route      GET / api/v1/students/:id
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

//  @desc       Register new Student
//  @route      POST / api/v1/students
//  @access     Private
exports.registerStudent = asyncHandler(async (req, res, next) => {
	const student = req.body;
	const control = new StudentController();
	const filter = { id: req.body.id };
	const foundStudent = await control.getStudent(filter);

	if (foundStudent.length != 0) {
		return next(
			new ErrorResponse(
				`Student alreday registered with id: ${req.body.id}.`,
				500
			)
		);
	}

	const savedStudent = await control.register(student);
	res.json({ success: true, data: savedStudent });
});

//  @desc       Update Student
//  @route      PUT / api/v1/students/:id
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
//  @route      DELETE / api/v1/students/:id
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

//-----------------Counter-----------------//

exports.getCounter = asyncHandler(async (req, res, next) => {
	const dao = new CounterDao();
	const result = await dao.getAll();

	res.json({ success: true, data: result });
});

//-----------------TMachines-----------------//

//  @desc       Get all TMachines
//  @route      GET / api/v1/tmachines
//  @access     Public
exports.getTMachines = asyncHandler((req, res, next) => {
	const control = new TMachineController();
	control.getTMachines().then((data) => {
		res.json({ success: true, data: data });
	});
});

//  @desc       Get single TMachine
//  @route      GET / api/v1/tmachines/:id
//  @access     Public
exports.getTMachine = asyncHandler(async (req, res, next) => {
	const control = new TMachineController();
	//const idTMachine = req.body.idTMachine;
	console.log(req.params);
	const foundTMachine = await control.getTMachine(req.params.id);
	if (foundTMachine.length == 0) {
		return next(
			new ErrorResponse(
				`TMachine not found with id: ${req.params.id}.`,
				404
			)
		);
	}
	res.json({ success: true, data: foundTMachine[0] });
});

//  @desc       Create new TMachine
//  @route      POST / api/v1/tmachines
//  @access     Private
exports.createTMachine = asyncHandler(async (req, res, next) => {
	const object = req.body;
	const control = new StudentController();
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

//  @desc       Update TMachine
//  @route      PUT / api/v1/tmachines/:id
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
//  @route      DELETE / api/v1/tmachines/:id
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
