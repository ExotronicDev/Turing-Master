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
tmachinesRouter.route("/").get(getTMachines).post(createTMachine);
tmachinesRouter
	.route("/:id")
	.get(getTMachine)
	.put(updateTMachine)
	.delete(deleteTMachine);

module.exports = tmachinesRouter;
