const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getCounter,
	registerStudent,
	loginStudent,
	logout,
	getMe,
	getStudents,
	getStudent,
	updateStudent,
	deleteStudent,
	getStudentTMachines,
	createStudentTMachine,
	updateStudentTMachine,
	deleteStudentTMachine,
} = require("../control/controllers/Controller");

const studentsRouter = express.Router();

// Counter
studentsRouter.route("/counter").get(getCounter);

// Authentication routes
studentsRouter.route("/register").post(registerStudent);
studentsRouter.route("/login").post(loginStudent);
studentsRouter.route("/logout").get(logout);
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
	.post(protect, createStudentTMachine); // cambio de ruta

// studentsRouter
// 	.route(":idStudent/tmachines/:idTMachine")
// 	.get(protect, getStudentTMachine)
// 	.put(protect, updateStudentTMachine)
// 	.delete(protect, deleteStudentTMachine);

module.exports = studentsRouter;
