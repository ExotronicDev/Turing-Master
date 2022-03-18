const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const State = mongoose.model("State", new Schema({
    id: {type: Number, index: true, required: true},
    name: {type: String, required: true},
    tMachine: {
        id: {type: Number, required: true},
        description: {type: String}
    },
    incomingTransitions: [{
        id: {type: Number},
        readValue: {type: String, maxlength: 1},
        writeValue: {type: String, maxlength: 1},
        moveValue: {type: Number},
        originState: {
            id: {type: Number},
            name: {type: String}
        }
    }],
    exitTransitions: [{
        id: {type: Number},
        readValue: {type: String, maxlength: 1},
        writeValue: {type: String, maxlength: 1},
        moveValue: {type: Number},
        targetState: {
            id: {type: Number},
            name: {type: String}
        }
    }]
}));

module.exports = State;