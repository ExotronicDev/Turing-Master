const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
	getTMachines,
	createTMachine,
	getTMachine,
	updateTMachine,
	deleteTMachine,
} = require("../control/controllers/Controller");

const tmachinesRouter = express.Router();

// TMachine routes
tmachinesRouter.route("/").get(getTMachines).post(protect, createTMachine);
tmachinesRouter
	.route("/:id")
	.get(protect, getTMachine)
	.put(protect, updateTMachine)
	.delete(protect, deleteTMachine);

module.exports = tmachinesRouter;
