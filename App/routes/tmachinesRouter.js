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

module.exports = tmachinesRouter;
