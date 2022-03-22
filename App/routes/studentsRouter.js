// Express
const { express, jwt, bcrypt } = require('../config/dependencies');
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const StudentController = require("../control/controllers/StudentController");
const { getStudents, registerStudent, getStudent, updateStudent, deleteStudent, getCounter } = require('../control/controllers/Controller');

const studentsRouter = express.Router();

studentsRouter
    .route("/")
    .get(getStudents)
    .post(registerStudent);

studentsRouter
    .route("/counter")
    .get(getCounter);

studentsRouter
    .route("/:id")
    .get(getStudent)
    .put(updateStudent)
    .delete(deleteStudent);

//---------------Student----------------------//
/*
// Get all Students
studentsRouter.get("/", async (req, res, next) => {    
    const control = new StudentController();
    control.getAll()
    .then((data) => {
        res.json({ success: true, data: data });
    })
    .catch((error) => {
        next(error);
    });    
});

// Get single Student
studentsRouter.get("/:id", async (req, res, next) => {    
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
            );
        }
        
        res.json(foundUser);
    }
    catch (err) {
        next(new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404));
    }
});

// Register Student
studentsRouter.post("/", async (req, res, next) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);

        if (foundUser.length != 0) {
            return next(
                new ErrorResponse(`Student alreday registered with id: ${req.params.id}.`, 500)
            );
        }

        const savedUser = await control.save(
            object
        );
        res.json(savedUser);
    }
    catch (err) {
        next(new ErrorResponse(`Student could not be registered. ${err.message}`, 500));
        // res.status(500).json({error: err.message});
    }
});

// Update Student
studentsRouter.put("/:id", async (req, res, next) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
            );
        }
        
        const modifiedUser = await control.update(
            filter, 
            object
        );
        res.json(modifiedUser);
    }
    catch (err) {
        next(new ErrorResponse(`Student could not be modified. ${err.message}`, 500));
    }
});

// Delete Student
studentsRouter.delete("/:id", async (req, res, next) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
            );
        }
        const deletedUser = await control.delete(filter);
        res.json(deletedUser);
    }
    catch (err) {
        next(new ErrorResponse(`Student could not be deleted. ${err.message}`, 500));
    }
});
*/

module.exports = studentsRouter;