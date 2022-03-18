const mongoose = require("mongoose");
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
        moveValue: {type: Number}
    }],
    exitTransitions: [{
        id: {type: Number},
        readValue: {type: String, maxlength: 1},
        writeValue: {type: String, maxlength: 1},
        moveValue: {type: Number}
    }]
}));