// Express
const { express, jwt, bcrypt } = require('../config/dependencies');
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const StudentController = require("../control/controllers/StudentController");

const studentsRouter = express.Router();

//---------------Student----------------------//

// Get all Students
studentsRouter.get("/", (req, res) => {    
    const control = new StudentController();
    control.getAll()
    .then((data) => {
        res.json({ success: true, data: data });
    })
    .catch((error) => {
        console.log(error);
    });    
});

// Get single Student
studentsRouter.get("/:id", (req, res, next) => {    
    const object = req.body; 
    const control = new ControlClient();
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
studentsRouter.post("/", async (req, res) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);

        if (foundUser.length != 0) {
            return res.json({msg:true});
        }

        const savedUser = await control.save(
            object
        );
        res.json(savedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Modify Student
studentsRouter.put("/:id", async (req, res) => {
    const object = req.body; 
    const control = new ControlClient();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return res.json({msg:true});
        }
        
        const modifiedUser = await control.modify(
            filter, 
            object
        );
        res.json(modifiedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete Student
studentsRouter.delete("/:id", async (req, res) => {
    const object = req.body; 
    const control = new ControlClient();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return res.json({msg:true});
        }
        const deletedUser = await control.delete(filter);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = studentsRouter;