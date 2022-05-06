const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const CounterSchema = new Schema({
	name: { type: String, required: true },
	count: { type: Number, required: true },
});

const Counter = mongoose.model("Counter", CounterSchema);

module.exports = Counter;
