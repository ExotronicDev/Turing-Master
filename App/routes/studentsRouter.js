const { express } = require("../config/dependencies");
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
} = require("../control/controllers/Controller");

const studentsRouter = express.Router();

studentsRouter.route("/counter").get(getCounter);

studentsRouter.route("/register").post(registerStudent);
studentsRouter.route("/login").post(loginStudent);

studentsRouter.route("/").get(getStudents);

studentsRouter
	.route("/:id")
	.get(getStudent)
	.put(updateStudent)
	.delete(deleteStudent);

studentsRouter
	.route("/:idStudent/tmachines")
	.get(getStudentTMachines)
	.post(createStudentTMachine);

studentsRouter.route(":idStudent/tmachines/:idTMachine").get().put().delete();

module.exports = studentsRouter;
