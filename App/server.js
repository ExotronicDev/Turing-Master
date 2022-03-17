const { express, morgan, mongoose, path } = require('./config/dependencies');

const { PORT, MONGO_URI } = require("./config/properties");
const routes = require("./routes/router"); // por ahora solo 1, luego separar en varios

const app = express(); 

// Conectar a la base MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB Database connected successfully!");
});

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(morgan("tiny"));
// app.use("/api", routes); // por ahora solo 1, luego agregar por cada router

app.listen(PORT, console.log(`Server initialized on port ${PORT}.`));