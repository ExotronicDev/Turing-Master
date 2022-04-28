const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getCourse,
	createCourse,
	cloneCourse,
	updateCourse,
	getCourseStudents,
	enrollStudent,
	addExercise,
	updateExercise,
	saveExerciseArrays,
	getExercise,
	getExercises,
	deleteExercise,
} = require("../control/controllers/Controller");

// Create router
const courseRouter = express.Router();

// Course routes
courseRouter.route("/").post(protect, createCourse);

courseRouter
	.route("/:code")
	.get(protect, getCourse)
	.put(protect, updateCourse)
	.post(protect, cloneCourse);

courseRouter.route("/:code/students").get(protect, getCourseStudents);
courseRouter.route("/:code/enrollStudent").post(protect, enrollStudent);

// Exercise routes
courseRouter.route("/:code/exercises").get(protect, getExercises).post(protect, addExercise);

courseRouter.route("/:code/exercises/:slug")
	.get(protect, getExercise)
	.put(protect, updateExercise)
	.put(protect, saveExerciseArrays)
	.delete(protect, deleteExercise);

module.exports = courseRouter;
