const { mongoose, bcryptjs } = require("../config/dependencies");
const { Schema } = mongoose;

const UserSchema = new Schema({
	id: {
		type: Number,
		index: true,
		unique: true,
		required: [true, "Please add an id."],
	},
	firstName: {
		type: String,
		required: [true, "Please add a first name."],
	},
	lastName: { type: String, required: [true, "Please add a last name."] },
	email: {
		type: String,
		required: [true, "Please add an email."],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email.",
		],
	},
	password: {
		type: String,
		required: [true, "Please add a password."],
		minlength: 8,
		select: false,
	},
	tMachines: [
		{
			id: { type: Number, required: true },
			description: { type: String },
		},
	],
});

// Encrypt password with bcryptjs
UserSchema.pre("save", async function (next) {
	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

const Student = mongoose.model("Student", UserSchema);

module.exports = Student;
