const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getCourses,
	getCourse,
	createCourse,
	cloneCourse,
	updateCourse,
	getCourseStudents,
	enrollStudent,
} = require("../control/controllers/Controller");

// Create router
const courseRouter = express.Router();

// Course routes
courseRouter.route("/").get(protect, getCourses).post(protect, createCourse);

courseRouter
	.route("/:code")
	.get(protect, getCourse)
	.put(protect, updateCourse)
	.post(protect, cloneCourse);

courseRouter.route("/:code/students").get(protect, getCourseStudents);
courseRouter.route("/:code/enrollStudent").post(protect, enrollStudent);

module.exports = courseRouter;
