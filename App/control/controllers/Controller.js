const asyncHandler = require("../../middleware/async");
const StudentController = require("./StudentController");

//  @desc       Get all Students
//  @route      GET / api/v1/students
//  @access     Public
exports.getStudents = asyncHandler((req, res, next) => {
    const control = new StudentController();
    control.getAll()
    .then((data) => {
        res.json({ success: true, data: data });
    })
    .catch((error) => {
        next(error);
    }); 
});

//  @desc       Get single Student
//  @route      GET / api/v1/students/:id
//  @access     Public
exports.getStudent = asyncHandler(async (req, res, next) => {
    const control = new StudentController();
    const filter = {id: req.params.id};
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

//  @desc       Register new Student
//  @route      POST / api/v1/students
//  @access     Private
exports.registerStudent = asyncHandler(async (req, res, next) => {
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

//  @desc       Update Student
//  @route      PUT / api/v1/students/:id
//  @access     Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
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

//  @desc       Delete Student
//  @route      DELETE / api/v1/students/:id
//  @access     Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
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