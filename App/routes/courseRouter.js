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
courseRouter.route("/").get(protect, getCourses);
courseRouter.route("/createCourse").post(protect, createCourse);
courseRouter.route("/:code").get(protect, getCourse);
courseRouter.route("/:code/clone").post(protect, cloneCourse);
courseRouter.route("/:code/update").post(protect, updateCourse);
courseRouter.route("/:code/getStudents").get(protect, getCourseStudents);
courseRouter.route("/:code/enrollStudent").post(protect, enrollStudent);

module.exports = courseRouter;