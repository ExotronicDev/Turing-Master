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
		// id: { type: "Number" },
		name: { type: String },
		// incomingTransitions: [
		// 	{
		// 		// id: { type: Number },
		// 		readValue: {
		// 			type: String,
		// 			maxlength: [
		// 				1,
		// 				"A transition can only read 1 character at a time",
		// 			],
		// 		},
		// 		writeValue: {
		// 			type: String,
		// 			maxlength: [
		// 				1,
		// 				"A transition can only write 1 character at a time",
		// 			],
		// 		},
		// 		moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
		// 		originState: {
		// 			// id: { type: Number },
		// 			name: { type: String },
		// 		},
		// 	},
		// ],
		// exitTransitions: [
		// 	{
		// 		// id: { type: "Number" },
		// 		readValue: {
		// 			type: String,
		// 			maxlength: [
		// 				1,
		// 				"A transition can only read 1 character at a time",
		// 			],
		// 		},
		// 		writeValue: {
		// 			type: String,
		// 			maxlength: [
		// 				1,
		// 				"A transition can only write 1 character at a time",
		// 			],
		// 		},
		// 		moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
		// 		targetState: {
		// 			// id: { type: Number },
		// 			name: { type: String },
		// 		},
		// 	},
		// ],
	},
	collaborators: [
		{
			id: { type: Number },
		},
	],
	states: [
		{
			// id: { type: Number },
			name: { type: String },
			incomingTransitions: [
				{
					// id: { type: Number },
					readValue: {
						type: String,
						maxlength: [
							1,
							"A transition can only read 1 character at a time",
						],
					},
					writeValue: {
						type: String,
						maxlength: [
							1,
							"A transition can only write 1 character at a time",
						],
					},
					moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
					originState: {
						// id: { type: Number },
						name: { type: String },
					},
				},
			],
			exitTransitions: [
				{
					// id: { type: Number },
					readValue: {
						type: String,
						maxlength: [
							1,
							"A transition can only read 1 character at a time",
						],
					},
					writeValue: {
						type: String,
						maxlength: [
							1,
							"A transition can only write 1 character at a time",
						],
					},
					moveValue: { type: Number, enum: [-1, 0, 1], default: 0 },
					targetState: {
						// id: { type: Number },
						name: { type: String },
					},
				},
			],
		},
	],
});

const TMachine = mongoose.model("TMachine", TMachineSchema);

module.exports = TMachine;
