const { express } = require("../config/dependencies");
const { protect } = require("../middleware/auth");
const {
    registerProfessor,
    loginProfessor,
    updateProfessor,
    deleteProfessor,
    getProfessors,
    getProfessor,
} = require("../control/controllers/Controller");

// Create router
const professorRouter = express.Router();

// Authentication routes
professorRouter.route("/register").post(registerProfessor);
professorRouter.route("/login").post(loginProfessor);

// Professor routes
professorRouter.route("/").get(getProfessors);
professorRouter
    .route("/:id")
    .get(getProfessor)
    .put(protect, updateProfessor)
    .delete(protect, deleteProfessor)

module.exports = professorRouter;