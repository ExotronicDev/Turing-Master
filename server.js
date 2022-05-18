const {
	express,
	morgan,
	path,
	dotenv,
	colors,
	cookieParser,
	mongoSanitize,
	helmet,
	xss,
	rateLimit,
	hpp,
	cors,
} = require("./config/dependencies");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Route files
const studentsRouter = require("./routes/studentsRouter");
const tmachinesRouter = require("./routes/tmachinesRouter");
const authRouter = require("./routes/authRouter");
const professorRouter = require("./routes/professorRouter");
const courseRouter = require("./routes/courseRouter");

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

// Mongo data sanitization
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: process.env.MAX_REQUESTS_MIN * 60 * 1000, // Requests per min * 60s * 1000ms
	max: 100,
});
app.use(limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Mount routers
app.use("/api/students", studentsRouter);
app.use("/api/tmachines", tmachinesRouter);
app.use("/api/auth", authRouter);
app.use("/api/professors", professorRouter);
app.use("/api/courses", courseRouter);

// Custom error messages
app.use(errorHandler);

// Start server
const server = app.listen(
	process.env.PORT || 8080,
	console.log(`Server initialized on port: ${process.env.PORT}.`.yellow.bold)
);

if (process.env.NODE_ENV === "production") {
	const build = path.join(__dirname, "public");
	app.use(express.static(build));
	app.get("*", async (req, res) => {
		res.sendFile(path.join(build, "index.html"));
	});
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, res, next) => {
	console.log(`Unhandled Error: ${err}`.red.bold);
	// Close server & exit process
	server.close(() => process.exit(1));
});
