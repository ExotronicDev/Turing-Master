const {
	express,
	morgan,
	path,
	dotenv,
	colors,
	cookieParser,
} = require("./config/dependencies");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Route files
const studentsRouter = require("./routes/studentsRouter");
const tmachinesRouter = require("./routes/tmachinesRouter");

// Config for environment variables
dotenv.config({ path: "./config/config.env" });

// Start Express App
const app = express();

// Connect to Database
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// Logging middleware
app.use(morgan("dev"));

// Mount routers
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/tmachines", tmachinesRouter);

// Custom error messages
app.use(errorHandler);

// Start server
const server = app.listen(
	process.env.PORT || 8080,
	console.log(`Server initialized on port: ${process.env.PORT}.`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, res, next) => {
	console.log(`Unhandled Error: ${err}`.red.bold);
	// Close server & exit process
	server.close(() => process.exit(1));
});
