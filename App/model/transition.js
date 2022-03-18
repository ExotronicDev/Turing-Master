const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const Transition = mongoose.model("Transition", new Schema({
    id: {type: Number, index: true, required: true},
    readValue: {type: String, maxlength: 1},
    writeValue: {type: String, maxlength: 1},
    moveValue: {type: Number},
    targetState: {
        id: {type: Number, required: true},
        name: {type: String, required: true}
    },
    originState: {
        id: {type: Number, required: true},
        name: {type: String, required: true}
    }
}));

module.exports = Transition;