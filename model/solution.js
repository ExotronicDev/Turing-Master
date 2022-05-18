const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const SolutionSchema = new Schema({
    grade: { type: Number },
    tMachine: {
        id: { type: Number, required: [true, "Please add a TMachine ID."] },
        description: { type: String, required: [true, "Please add a TMachine description."] }
    },
    student: {
        id: { type: Number, required: [true, "Please add a Student ID."] }
    },
    exercise: {
        slugName: { type: String, required: [true, "Please add an Exercise Name."] }
    }
});

const Solution = mongoose.model("Solution", SolutionSchema);

module.exports = Solution;