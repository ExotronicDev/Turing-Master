const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const TMachineSchema = new Schema({
	id: { type: Number, index: true, unique: true, required: true },
	description: {
		type: String,
		required: [true, "Please add a description to the Turing Machine."],
	},
	owner: {
		id: { type: Number, required: true },
	},
	initialState: {
		id: { type: Number },
		name: { type: String },
	},
	collaborators: [
		{
			id: { type: Number },
		},
	],
	states: [
		{
			id: { type: Number },
			name: { type: String },
		},
	],
});

const TMachine = mongoose.model("TMachine", TMachineSchema);

module.exports = TMachine;
