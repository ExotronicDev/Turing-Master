const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
    registerProfessor,
    loginProfessor,
} = require("../control/controllers/Controller");

// Create router
const professorRouter = express.Router();

// Authentication routes
professorRouter.route("/register").post(registerProfessor);
professorRouter.route("/login").post(loginProfessor);

module.exports = professorRouter;