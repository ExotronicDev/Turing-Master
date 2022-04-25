const { mongoose } = require("../config/dependencies");
const { Schema } = mongoose;

const StateSchema = new Schema({
	name: { type: String },
	initialState: { type: Boolean, default: false },
	incomingTransitions: [{
		readValue: { type: String, maxlength: [1, "A transition can only read 1 character at a time"] },
		writeValue: { type: String, maxlength: [1, "A transition can only write 1 character at a time"] },
		moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
		originState: {
			name: {type: String}
		}
	}],
	exitTransitions: [{
		readValue: { type: String, maxlength: [1, "A transition can only read 1 character at a time"] },
		writeValue: { type: String, maxlength: [1, "A transition can only write 1 character at a time"] },
		moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
		targetState: {
			name: {type: String}
		}
	}]
});

const TMachineSchema = new Schema({
	id: { type: Number, index: true, unique: true, required: true },
	description: {
		type: String,
		required: [true, "Please add a description to the Turing Machine."]
	},
	owner: {
		id: { type: Number, required: true }
	},
	states: [StateSchema]
});

const TMachine = mongoose.model("TMachine", TMachineSchema);

module.exports = TMachine;
