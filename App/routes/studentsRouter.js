const { express } = require("../config/dependencies");
const {
	getStudents,
	registerStudent,
	getStudent,
	updateStudent,
	deleteStudent,
	getCounter,
	getStudentTMachines,
	createStudentTMachine,
} = require("../control/controllers/Controller");

const studentsRouter = express.Router();

studentsRouter.route("/").get(getStudents).post(registerStudent);

studentsRouter.route("/counter").get(getCounter);

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
