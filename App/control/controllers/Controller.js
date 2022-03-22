const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("./../../utils/errorResponse");
const StudentController = require("./StudentController");

//  @desc       Get all Students
//  @route      GET / api/v1/students
//  @access     Public
exports.getStudents = asyncHandler((req, res, next) => {
    const control = new StudentController();
    control.getAll()
        .then((data) => {
            res.json({ success: true, data: data });
        });
});

//  @desc       Get single Student
//  @route      GET / api/v1/students/:id
//  @access     Public
exports.getStudent = asyncHandler(async (req, res, next) => {
    const control = new StudentController();
    const filter = {id: req.params.id};
    const foundUser = await control.find(filter);
    if (!foundUser) {
        return next(
            new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
        );
    }        
    res.json({success: true, data: foundUser});
});

//  @desc       Register new Student
//  @route      POST / api/v1/students
//  @access     Private
exports.registerStudent = asyncHandler(async (req, res, next) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: req.params.id};
    const foundUser = await control.find(filter);

    if (foundUser.length != 0) {
        return next(
            new ErrorResponse(`Student alreday registered with id: ${req.params.id}.`, 500)
        );
    }

    const savedUser = await control.save(
        object
    );
    res.json({success: true, data: savedUser});
});

//  @desc       Update Student
//  @route      PUT / api/v1/students/:id
//  @access     Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
    const object = req.body; 
    const control = new StudentController();
    const filter = {id: req.params.id};
    const foundUser = await control.find(filter);
    if (!foundUser) { 
        return next(
            new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
        );
    }
    
    const updatedUser = await control.update(
        filter, 
        object
    );
    res.json({success: true, data: updatedUser});
});

//  @desc       Delete Student
//  @route      DELETE / api/v1/students/:id
//  @access     Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
    const control = new StudentController();
    const filter = {id: req.params.id};    
    const foundUser = await control.find(filter);
    if (!foundUser) {
        return next(
            new ErrorResponse(`Student not found with id: ${req.params.id}.`, 404)
        );
    }
    const deletedUser = await control.delete(filter);
    res.json({success: true, data: deletedUser});
});