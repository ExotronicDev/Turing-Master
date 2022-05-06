const student = require("../../model/student");

module.exports = class StudentDao {
	async find(filter) {
		return await student.find(filter).sort("firstName");
	}

	async findWithPassword(filter) {
		return await student.findOne(filter).select("+password");
	}

	async save(object) {
		return await object.save();
	}

	async delete(filter) {
		return await student.deleteOne(filter);
	}

	//Esto de los arrays lo manejan los controladores mejor.
	async update(filter, object) {
		return await student.updateOne(filter, object);
	}

	async getAll() {
		return await student.find({}).sort("firstName");
	}
};
