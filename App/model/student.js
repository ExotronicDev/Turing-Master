const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const Student = mongoose.model("Student", new Schema({
    id: {type: Number, index: true, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, minlength: 8},
    tMachines: [{
        id: {type: Number, required: true},
        description: {type: String}
    }]
}));

module.exports = Student;