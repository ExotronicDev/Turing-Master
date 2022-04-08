const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");

const { logout, getMe } = require("../control/controllers/Controller");

// Create router
const authRouter = express.Router();

// Auth routes for any user
authRouter.route("/logout").get(logout);
authRouter.route("/me").get(protect, getMe);

module.exports = authRouter;
