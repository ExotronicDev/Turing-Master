const { express, jwt, bcrypt } = require("../config/dependencies");
const {
	getTMachines,
	createTMachine,
	getTMachine,
	updateTMachine,
	deleteTMachine,
} = require("../control/controllers/Controller");

const tmachinesRouter = express.Router();

tmachinesRouter.route("/").get(getTMachines).post(createTMachine);

tmachinesRouter
	.route("/:id")
	.get(getTMachine)
	.put(updateTMachine)
	.delete(deleteTMachine);


//---------------TMachine----------------------//
/*
// Get all Machines
tmachinesRouter.get("/", async (req, res, next) => {    
    const control = new TMachineController();
    control.getAll()
    .then((data) => {
        res.json({ success: true, data: data });
    })
    .catch((error) => {
        next(error);
    });    
});

// Get single TMachine
tmachinesRouter.get("/:id", async (req, res, next) => {    
    const object = req.body; 
    const control = new TMachineController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`TMachine not found with id: ${req.params.id}.`, 404)
            );
        }
        
        res.json(foundUser);
    }
    catch (err) {
        next(new ErrorResponse(`TMachine not found with id: ${req.params.id}.`, 404));
    }
});

// Register TMachine
tmachinesRouter.post("/", async (req, res, next) => {
    const object = req.body; 
    const control = new TMachineController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);

        if (foundUser.length != 0) {
            return next(
                new ErrorResponse(`TMachine alreday registered with id: ${req.params.id}.`, 500)
            );
        }

        const savedUser = await control.save(
            object
        );
        res.json(savedUser);
    }
    catch (err) {
        next(new ErrorResponse(`TMachine could not be registered. ${err.message}`, 500));
        // res.status(500).json({error: err.message});
    }
});

// Update TMachine
tmachinesRouter.put("/:id", async (req, res, next) => {
    const object = req.body; 
    const control = new TMachineController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`TMachine not found with id: ${req.params.id}.`, 404)
            );
        }
        
        const modifiedUser = await control.update(
            filter, 
            object
        );
        res.json(modifiedUser);
    }
    catch (err) {
        next(new ErrorResponse(`TMachine could not be modified. ${err.message}`, 500));
    }
});

// Delete TMachine
tmachinesRouter.delete("/:id", async (req, res, next) => {
    const object = req.body; 
    const control = new TMachineController();
    const filter = {id: object.id};
    try {        
        const foundUser = await control.find(filter);
        if (!foundUser) {
            return next(
                new ErrorResponse(`TMachine not found with id: ${req.params.id}.`, 404)
            );
        }
        const deletedUser = await control.delete(filter);
        res.json(deletedUser);
    }
    catch (err) {
        next(new ErrorResponse(`TMachine could not be deleted. ${err.message}`, 500));
    }
});
*/

module.exports = tmachinesRouter;
