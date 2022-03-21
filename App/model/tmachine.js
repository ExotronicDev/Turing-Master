const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const TMachine = mongoose.model("TMachine", new Schema({
    id: {type: Number, index: true, unique: true, required: true},
    description: {type: String, required: true},
    owner: {
        id: {type: Number, required: true}
    },
    initialState: {
        id: {type: Number},
        name: {type: String}
    },
    collaborators: [{
        id: {type: Number}
    }],
    states: [{
        id: {type: Number},
        name: {type: String}
    }]
}));

module.exports = TMachine;