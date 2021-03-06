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
	getStudentCourses,
} = require("../control/controllers/Controller");

// Create router
const studentsRouter = express.Router();

// Counter
studentsRouter.route("/counter").get(getCounter);

// Authentication routes
studentsRouter.route("/register").post(registerStudent);
studentsRouter.route("/login").post(loginStudent);
// studentsRouter.route("/logout").get(logout);
// studentsRouter.route("/me").get(protect, getMe);

// Student routes
studentsRouter.route("/").get(getStudents);
studentsRouter
	.route("/:id")
	.get(getStudent)
	.put(protect, updateStudent)
	.delete(protect, deleteStudent);

// Student TMachines routes
studentsRouter.route("/:id/tmachines").get(protect, getStudentTMachines);

// Student Courses routes
studentsRouter.route("/:id/courses").get(protect, getStudentCourses);

module.exports = studentsRouter;
