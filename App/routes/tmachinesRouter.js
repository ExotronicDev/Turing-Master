const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getTMachines,
	createTMachine,
	getTMachine,
	updateTMachine,
	deleteTMachine,
	createState,
	updateState,
	setInitialState,
	deleteState,
	createTransition,
	updateTransition,
	deleteTransition,
} = require("../control/controllers/Controller");

// Create router
const tmachinesRouter = express.Router();

// TMachine routes
tmachinesRouter.route("/").get(getTMachines).post(protect, createTMachine);
tmachinesRouter
	.route("/:id")
	.get(protect, getTMachine)
	.put(protect, updateTMachine)
	.delete(protect, deleteTMachine);

// States routes
tmachinesRouter
	.route("/states")
	.post(createState)
	.put(updateState)
	.delete(deleteState);
tmachinesRouter.route("/states/initial").put(setInitialState);

// Transitions routes
tmachinesRouter
	.route("/states/transitions")
	.post(createTransition)
	.put(updateTransition)
	.delete(deleteTransition);

module.exports = tmachinesRouter;
