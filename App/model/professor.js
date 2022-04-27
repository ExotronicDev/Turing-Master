const { mongoose, bcrypt, jwt } = require("../config/dependencies");
const { Schema } = mongoose;

const ProfessorSchema = new Schema({
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
	lastName: {
		type: String,
		required: [true, "Please add an email."],
	},
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
		minlength: [
			8,
			"Password is too short. The minimum required is 8 characters long.",
		],
		select: false,
	},
	courses: [
		{
			code: { type: String },
			name: { type: String }
		}
	],
});

// Encrypt password with bcrypt
ProfessorSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Sign JWT and return
ProfessorSchema.methods.getSignedJwtToken = function () {
	return jwt.sign(
		{ id: this.id, role: "professors" },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

// Match user entered password to hashed password of user in database
ProfessorSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const Professor = mongoose.model("Professor", ProfessorSchema);

module.exports = Professor;
