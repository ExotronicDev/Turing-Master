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
	getTestCases,
	getExampleCases,
	createTestCase,
	updateTestCase,
	deleteTestCase,
	createExampleCase,
	updateExampleCase,
	deleteExampleCase,
	createSolution,
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

// Course students routes
courseRouter
	.route("/:code/students")
	.get(protect, getCourseStudents)
	.post(protect, enrollStudent);

// Exercise routes
courseRouter
	.route("/:code/exercises")
	.get(protect, getExercises)
	.post(protect, addExercise);
courseRouter
	.route("/:code/exercises/:slug")
	.get(protect, getExercise)
	.put(protect, updateExercise)
	.post(protect, saveExerciseArrays)
	.delete(protect, deleteExercise);

// Exercise Test Cases
courseRouter
	.route("/:code/exercises/:slug/tests")
	.get(protect, getTestCases)
	.post(protect, createTestCase)
	.put(protect, updateTestCase)
	.delete(protect, deleteTestCase);

// Exercise Example Cases
courseRouter
	.route("/:code/exercises/:slug/examples")
	.get(protect, getExampleCases)
	.post(protect, createExampleCase)
	.put(protect, updateExampleCase)
	.delete(protect, deleteExampleCase);

// Exercise Solutions
courseRouter
	.route("/:code/exercises/:slug/solutions")
	.post(protect, createSolution);

module.exports = courseRouter;
