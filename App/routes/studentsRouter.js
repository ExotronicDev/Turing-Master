const { express, jwt, bcrypt } = require("../config/dependencies");
const {
	getStudents,
	registerStudent,
	getStudent,
	updateStudent,
	deleteStudent,
	getCounter,
} = require("../control/controllers/Controller");

const studentsRouter = express.Router();

studentsRouter.route("/").get(getStudents).post(registerStudent);

studentsRouter.route("/counter").get(getCounter);

studentsRouter
	.route("/:id")
	.get(getStudent)
	.put(updateStudent)
	.delete(deleteStudent);

module.exports = studentsRouter;
