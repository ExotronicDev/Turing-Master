const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getCounter,
	registerStudent,
	loginStudent,
	getStudents,
	getStudent,
	updateStudent,
	deleteStudent,
	getStudentTMachines,
	createStudentTMachine,
	getMe,
} = require("../control/controllers/Controller");

const studentsRouter = express.Router();

// Counter
studentsRouter.route("/counter").get(getCounter);

// Authentication routes
studentsRouter.route("/register").post(registerStudent);
studentsRouter.route("/login").post(loginStudent);
studentsRouter.route("/me").get(protect, getMe);

// Student routes
studentsRouter.route("/").get(getStudents);
studentsRouter
	.route("/:id")
	.get(getStudent)
	.put(protect, updateStudent)
	.delete(protect, deleteStudent);

// Student TMachines routes
studentsRouter
	.route("/:idStudent/tmachines")
	.get(protect, getStudentTMachines)
	.post(protect, createStudentTMachine);

// studentsRouter.route(":idStudent/tmachines/:idTMachine")
// 	.get(protect, getStudentTMachines)
// 	.put(protect, updateStudentTMachine)
// 	.delete(protect, deleteStudentTMachine);

module.exports = studentsRouter;
