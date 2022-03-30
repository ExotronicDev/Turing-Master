const { mongoose, bcrypt, jwt } = require("../config/dependencies");
const { Schema } = mongoose;

const StudentSchema = new Schema({
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
		index: true,
		unique: true,
		required: [true, "Please add an email."],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email.",
		],
	},
	password: {
		type: String,
		required: [true, "Please add a password."],
		minlength: [8, "Password is too short. The minimum required is 8 characters long."],
		select: false,
	},
	tMachines: [
		{
			id: { type: Number, required: true },
			description: { type: String },
		},
	],
});

// Encrypt password with bcrypt
StudentSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Sign JWT and return
StudentSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Match user entered password to hashed password of user in database
StudentSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
