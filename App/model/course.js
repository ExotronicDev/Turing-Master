const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const InputCaseSchema = new Schema({
    number: { type: Number, required: true, index: true, unique: true },
    input: { type: String, required: true },
    output: { type: String, required: true }
});

const ExerciseSchema = new Schema({
    name: { type: String, unique: true, index: true, required: true },
    description: { type: String, required: true},
    inputDescription: { type: String, required: true },
    outputDescription: { type: String },
    exampleCases: [InputCaseSchema],
    testCases: [InputCaseSchema]
});

const StudentSchemaAux = new Schema({
    id: { type: Number },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String }
});

const CourseSchema = new Schema({
    code: {
        type: String,
        index: true,
        unique: true,
        required: [true, "Please add a code."]
    },
    name: {
        type: String,
        required: [true, "Please enter a course name."]
    },
    professor: {
        id: { type: Number, required: true }
    },
    students: [StudentSchemaAux],
    exercises: [ExerciseSchema]
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;