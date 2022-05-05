const { mongoose } = require("./dependencies");

// Connect to MongoDB
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Database connected on host: ${conn.connection.host}.`.cyan.underline.bold);
}

module.exports = connectDB;