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
	simulateTMachine
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

// Simulation route
tmachinesRouter.route("/simulate").post(simulateTMachine);

// States routes
tmachinesRouter.route("/states/").post(createState);
tmachinesRouter.route("/states/").put(updateState);
tmachinesRouter.route("/states/").delete(deleteState);
tmachinesRouter.route("/states/initial").put(setInitialState);

// Transitions routes
tmachinesRouter.route("/states/transitions/").post(createTransition);
tmachinesRouter.route("/states/transitions/").put(updateTransition);
tmachinesRouter.route("/states/transitions/").delete(deleteTransition);

module.exports = tmachinesRouter;
