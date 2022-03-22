const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const Counter = mongoose.model("Counter", new Schema({
    name: {type: String, required: true},
    count: {type: Number, required: true}
}));

module.exports = Counter;