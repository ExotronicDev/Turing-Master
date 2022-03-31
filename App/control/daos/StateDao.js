const state = require("../../model/state");

module.exports = class StateDao {
	async find(filter) {
		return await state.find(filter);
	}

	async save(object) {
		return await object.save();
	}

	async delete(filter) {
		return await state.deleteOne(filter);
	}

	async deleteMany(filter) {
		return await state.deleteMany(filter);
	}

	async update(filter, object) {
		return await state.updateOne(filter, object);
	}

	async getAll() {
		return await state.find({});
	}
};
